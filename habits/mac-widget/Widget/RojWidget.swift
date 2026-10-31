// Roj Habit's Mac widget, in the small, medium and large sizes of the widget gallery.
//
// The app (Electron) writes today's habits to Widget/today.json in its Application Support
// folder (www/app.js widgetSnapshot). The widget draws that file. Clicking a habit's circle runs
// ToggleHabit, which updates the file at once, so the widget redraws with the tick, and leaves a
// note in Widget/ticks/ that the app picks up and applies to its own data (electron/main.js).

import AppIntents
import AppKit
import SwiftUI
import WidgetKit

// MARK: - Data

struct Snapshot: Codable {
    struct Item: Codable, Identifiable {
        var id: String
        var name: String
        var color: String
        var done: Bool // done today, or a weekly habit whose week is already met
        var weekMet: Bool
        var count: Int
        var target: Int
        var frac: Double
        var meta: String?
        var sub: String? // "1 of 13 glasses", "2 of 3 this week", "Morning"
        var streak: Int?
    }

    struct Day: Codable {
        var l: String // M, T, W…
        var s: String // full, some, none, rest, later
        var now: Bool
    }

    var day: String // "2026-10-31"
    var date: String // "SATURDAY 31 OCT"
    var short: String // "SAT 31"
    var items: [Item]
    var week: [Day]

    var done: Int { items.filter(\.done).count }

    static let sample = Snapshot(
        day: Files.todayKey(), date: "SATURDAY 31 OCT", short: "SAT 31",
        items: [
            Item(id: "a", name: "Walk 8,000 steps", color: "#3F8F8C", done: false, weekMet: false, count: 0, target: 1, frac: 0, meta: nil),
            Item(id: "b", name: "Read 10 pages", color: "#C2704B", done: false, weekMet: false, count: 0, target: 1, frac: 0, meta: nil),
            Item(id: "c", name: "Drink water", color: "#4C84BC", done: false, weekMet: false, count: 5, target: 8, frac: 0.625, meta: "5/8"),
            Item(id: "d", name: "Meditate", color: "#7F72BE", done: true, weekMet: false, count: 1, target: 1, frac: 1, meta: nil),
            Item(id: "e", name: "Sleep by 11", color: "#626875", done: true, weekMet: false, count: 1, target: 1, frac: 1, meta: nil)
        ],
        week: ["M", "T", "W", "T", "F", "S", "S"].enumerated().map { i, l in
            Day(l: l, s: i < 5 ? (i % 2 == 0 ? "some" : "full") : i == 5 ? "some" : "later", now: i == 5)
        })
}

enum Files {
    // The real home folder. Inside the sandbox NSHomeDirectory() is the widget's own container.
    static var folder: URL {
        let home = getpwuid(getuid()).map { String(cString: $0.pointee.pw_dir) } ?? NSHomeDirectory()
        return URL(fileURLWithPath: home).appendingPathComponent("Library/Application Support/Roj Habit/Widget", isDirectory: true)
    }
    static var today: URL { folder.appendingPathComponent("today.json") }
    static var ticks: URL { folder.appendingPathComponent("ticks", isDirectory: true) }

    static func load() -> Snapshot? {
        guard let data = try? Data(contentsOf: today) else { return nil }
        return try? JSONDecoder().decode(Snapshot.self, from: data)
    }
    static func save(_ snap: Snapshot) {
        if let data = try? JSONEncoder().encode(snap) { try? data.write(to: today, options: .atomic) }
    }
    static func todayKey(_ date: Date = Date()) -> String {
        let f = DateFormatter()
        f.calendar = Calendar(identifier: .gregorian)
        f.locale = Locale(identifier: "en_US_POSIX")
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }
}

// MARK: - Checking a habit off

struct ToggleHabit: AppIntent {
    static var title: LocalizedStringResource = "Check off a habit"
    static var description = IntentDescription("Checks a Roj Habit habit off for today, or adds one to a count.")

    @Parameter(title: "Habit") var habitID: String

    init() {}
    init(id: String) { habitID = id }

    func perform() async throws -> some IntentResult {
        guard var snap = Files.load(), snap.day == Files.todayKey(),
              let i = snap.items.firstIndex(where: { $0.id == habitID }) else { return .result() }
        // The app's rule: add one until the goal, then back to zero.
        var it = snap.items[i]
        it.count = it.count >= it.target ? 0 : it.count + 1
        it.done = it.count >= it.target || it.weekMet
        it.frac = it.done ? 1 : Double(it.count) / Double(it.target)
        if it.target > 1 { it.meta = "\(it.count)/\(it.target)" }
        snap.items[i] = it
        Files.save(snap)
        // The note for the app.
        try? FileManager.default.createDirectory(at: Files.ticks, withIntermediateDirectories: true)
        let note: [String: Any] = ["id": habitID, "day": snap.day, "at": Int(Date().timeIntervalSince1970 * 1000)]
        if let data = try? JSONSerialization.data(withJSONObject: note) {
            try? data.write(to: Files.ticks.appendingPathComponent("\(Int(Date().timeIntervalSince1970 * 1000))-\(UUID().uuidString).json"))
        }
        return .result()
    }
}

// MARK: - Timeline

struct Entry: TimelineEntry {
    let date: Date
    let snap: Snapshot?
    // The file is from another day: the app has not been opened since midnight.
    var stale: Bool { snap.map { $0.day != Files.todayKey(date) } ?? true }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> Entry { Entry(date: Date(), snap: Snapshot.sample) }

    func getSnapshot(in context: Context, completion: @escaping (Entry) -> Void) {
        let snap = Files.load()
        completion(Entry(date: Date(), snap: context.isPreview && snap == nil ? Snapshot.sample : snap))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> Void) {
        let now = Date()
        let snap = Files.load()
        let midnight = Calendar.current.startOfDay(for: now.addingTimeInterval(24 * 3600))
        // Redraw at midnight (the day turns over) and every half hour in case a reload was missed.
        let entries = [Entry(date: now, snap: snap), Entry(date: midnight, snap: snap)]
        completion(Timeline(entries: entries, policy: .after(min(midnight, now.addingTimeInterval(1800)))))
    }
}

// MARK: - Look
//
// On the desktop macOS draws widgets "vibrant": it takes the colour out and shows them in white
// on the wallpaper's glass. Colour can't carry meaning there, so every colour comes from Look,
// which in that mode switches to shades of the primary colour, and the parts that matter most
// (the ring, ticked circles, the done count) are marked accentable so macOS can tint them.

enum Palette {
    static func dynamic(_ light: NSColor, _ dark: NSColor) -> Color {
        Color(nsColor: NSColor(name: nil) { $0.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua ? dark : light })
    }
    static let paper = dynamic(NSColor(red: 0.988, green: 0.980, blue: 0.965, alpha: 1), NSColor(red: 0.102, green: 0.106, blue: 0.125, alpha: 1))
    static let ink = dynamic(NSColor(red: 0.090, green: 0.094, blue: 0.106, alpha: 1), NSColor(red: 0.949, green: 0.945, blue: 0.933, alpha: 1))
    static let secondary = dynamic(NSColor(red: 0.467, green: 0.451, blue: 0.420, alpha: 1), NSColor(red: 0.600, green: 0.588, blue: 0.565, alpha: 1))
    static let accent = dynamic(NSColor(red: 0.910, green: 0.588, blue: 0.180, alpha: 1), NSColor(red: 0.949, green: 0.651, blue: 0.271, alpha: 1))
    static let accentText = dynamic(NSColor(red: 0.659, green: 0.357, blue: 0.047, alpha: 1), NSColor(red: 0.961, green: 0.710, blue: 0.396, alpha: 1))
}

struct Look {
    let full: Bool

    init(_ mode: WidgetRenderingMode) { full = mode == .fullColor }

    var ink: Color { full ? Palette.ink : .primary }
    var secondary: Color { full ? Palette.secondary : Color.primary.opacity(0.62) }
    var accent: Color { full ? Palette.accent : .primary }
    var accentText: Color { full ? Palette.accentText : .primary }
    var track: Color { full ? Palette.accent.opacity(0.2) : Color.primary.opacity(0.2) }
    var card: Color { full ? Palette.ink.opacity(0.045) : Color.primary.opacity(0.1) }
    var line: Color { full ? Palette.ink.opacity(0.08) : Color.primary.opacity(0.18) }
    func habit(_ hex: String) -> Color { full ? Color(hex: hex) : .primary }
}

extension Color {
    init(hex: String) {
        let v = UInt64(hex.trimmingCharacters(in: CharacterSet(charactersIn: "#")), radix: 16) ?? 0x4C84BC
        self.init(red: Double((v >> 16) & 0xFF) / 255, green: Double((v >> 8) & 0xFF) / 255, blue: Double(v & 0xFF) / 255)
    }
}

extension Snapshot {
    // How full the ring is: count habits add their share, so 1 of 13 glasses already shows.
    var fill: Int { items.isEmpty ? 0 : Int((items.map(\.frac).reduce(0, +) / Double(items.count) * 100).rounded()) }
}

// One piece of ring per habit, filling in as it gets done, like the app's Today.
struct SegRing: View {
    let fracs: [Double]
    let width: CGFloat
    let look: Look

    var body: some View {
        let n = max(fracs.count, 1)
        let gap = fracs.count > 1 ? min(0.04, 0.5 / Double(n)) : 0
        let seg = 1.0 / Double(n) - gap
        ZStack {
            ForEach(0..<n, id: \.self) { i in
                let start = Double(i) / Double(n) + gap / 2
                Circle().trim(from: start, to: start + seg)
                    .stroke(look.track, style: StrokeStyle(lineWidth: width, lineCap: .round))
                if i < fracs.count, fracs[i] > 0 {
                    Circle().trim(from: start, to: start + seg * fracs[i])
                        .stroke(look.accent, style: StrokeStyle(lineWidth: width, lineCap: .round))
                        .widgetAccentable()
                }
            }
        }
        .rotationEffect(.degrees(-90))
        .padding(width / 2)
    }
}

struct Ring: View {
    let snap: Snapshot
    let size: CGFloat
    let look: Look

    var body: some View {
        ZStack {
            SegRing(fracs: snap.items.map(\.frac), width: size * 0.105, look: look)
            if !snap.items.isEmpty && snap.done == snap.items.count {
                Image(systemName: "checkmark").font(.system(size: size * 0.3, weight: .bold)).foregroundStyle(look.accent).widgetAccentable()
            } else {
                HStack(alignment: .firstTextBaseline, spacing: 0) {
                    Text("\(snap.fill)").font(.system(size: size * 0.28, weight: .bold, design: .rounded))
                    Text("%").font(.system(size: size * 0.15, weight: .semibold, design: .rounded)).foregroundStyle(look.secondary)
                }
                .foregroundStyle(look.ink)
                .monospacedDigit()
            }
        }
        .frame(width: size, height: size)
    }
}

// The check circle: an outline in the habit's colour, a partly drawn ring with the count for
// count habits, filled with a tick when done.
struct Bubble: View {
    let item: Snapshot.Item
    let size: CGFloat
    let look: Look

    var body: some View {
        let c = look.habit(item.color)
        let w = max(1.6, size * 0.09)
        ZStack {
            if item.done {
                Circle().fill(c).widgetAccentable()
                Image(systemName: "checkmark").font(.system(size: size * 0.46, weight: .heavy))
                    .foregroundStyle(look.full ? Color.white : Color.black.opacity(0.85))
            } else if item.frac > 0 {
                Circle().stroke(c.opacity(0.25), lineWidth: w)
                Circle().trim(from: 0, to: item.frac).stroke(c, style: StrokeStyle(lineWidth: w, lineCap: .round))
                    .rotationEffect(.degrees(-90)).widgetAccentable()
                Text("\(item.count)").font(.system(size: size * 0.42, weight: .bold, design: .rounded)).foregroundStyle(look.ink)
            } else {
                Circle().stroke(c.opacity(look.full ? 0.8 : 0.55), lineWidth: w)
            }
        }
        .frame(width: size, height: size)
    }
}

// The line under a habit's name: its count, its week, its streak, or its part of the day.
struct Sub: View {
    let item: Snapshot.Item
    let look: Look

    var body: some View {
        HStack(spacing: 3) {
            if let streak = item.streak, streak >= 2, item.target == 1, item.meta == nil {
                Image(systemName: "flame.fill").font(.system(size: 9.5)).foregroundStyle(look.full ? Palette.accent : look.secondary)
                Text("\(streak) days")
            } else {
                Text(item.sub ?? item.meta ?? "")
            }
        }
        .font(.system(size: 11.5, weight: .medium))
        .foregroundStyle(look.secondary)
        .lineLimit(1)
    }
}

// Three densities, picked by the height each habit gets: a card with a progress bar when there
// is plenty, two lines when there is some, one line when the list is long.
enum Density { case card, twoLine, line }

struct Row: View {
    let item: Snapshot.Item
    let density: Density
    let look: Look

    var body: some View {
        Button(intent: ToggleHabit(id: item.id)) {
            content.contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder var content: some View {
        switch density {
        case .card:
            HStack(spacing: 12) {
                Bubble(item: item, size: 26, look: look)
                VStack(alignment: .leading, spacing: 4) {
                    name(14)
                    Sub(item: item, look: look)
                    if item.target > 1 && !item.done {
                        bar.frame(height: 4)
                    }
                }
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
            .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(look.card))
        case .twoLine:
            HStack(spacing: 11) {
                Bubble(item: item, size: 22, look: look)
                VStack(alignment: .leading, spacing: 2) {
                    name(13.5)
                    Sub(item: item, look: look)
                }
                Spacer(minLength: 0)
            }
            .frame(maxHeight: .infinity)
        case .line:
            HStack(spacing: 10) {
                Bubble(item: item, size: 18, look: look)
                name(13)
                Spacer(minLength: 4)
                if let meta = item.meta {
                    Text(meta).font(.system(size: 11, weight: .semibold)).foregroundStyle(look.secondary).monospacedDigit()
                }
            }
            .frame(maxHeight: .infinity)
        }
    }

    func name(_ size: CGFloat) -> some View {
        Text(item.name)
            .font(.system(size: size, weight: .semibold))
            .foregroundStyle(item.done ? look.secondary : look.ink)
            .lineLimit(1)
    }

    var bar: some View {
        GeometryReader { g in
            ZStack(alignment: .leading) {
                Capsule().fill(look.habit(item.color).opacity(0.18))
                Capsule().fill(look.habit(item.color)).frame(width: max(4, g.size.width * item.frac)).widgetAccentable()
            }
        }
    }
}

// "2 of 5 done", with the done count in marigold.
struct Title: View {
    let snap: Snapshot
    let size: CGFloat
    let look: Look

    var body: some View {
        Group {
            if snap.items.isEmpty {
                Text("Nothing today")
            } else if snap.done == snap.items.count {
                Text("All done")
            } else {
                Text("\(snap.done)").foregroundColor(look.accentText) + Text(" of \(snap.items.count) done")
            }
        }
        .font(.system(size: size, weight: .bold))
        .foregroundStyle(look.ink)
        .lineLimit(1)
        .minimumScaleFactor(0.75)
    }
}

// The habits in the height it is given, open ones first. Each gets an even share; with more than
// fit, the last place says how many more.
struct Checklist: View {
    let snap: Snapshot
    let height: CGFloat
    let maxRows: Int
    let look: Look

    var body: some View {
        let n = snap.items.count
        let lineSlots = max(1, min(maxRows, Int(height / 30)))
        let per = height / CGFloat(max(n, 1))
        let density: Density = per >= 58 && n <= 3 ? .card : per >= 40 ? .twoLine : .line
        let slots = density == .line ? lineSlots : n
        let more = n > slots
        let shown = Array(snap.items.prefix(more ? slots - 1 : slots))
        VStack(alignment: .leading, spacing: density == .card ? 8 : 0) {
            ForEach(shown) { Row(item: $0, density: density, look: look) }
            if more {
                Text("+\(n - shown.count) more")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(look.secondary)
                    .padding(.leading, 28)
                    .frame(maxHeight: .infinity)
            } else if density == .card {
                // cards stay a sensible size instead of stretching tall
                Spacer(minLength: 0).frame(height: max(0, height - CGFloat(n) * 64 - CGFloat(n - 1) * 8))
            } else if density == .line && shown.count < slots {
                Spacer(minLength: 0)
            }
        }
        .frame(height: height, alignment: .top)
    }
}

struct WeekStrip: View {
    let days: [Snapshot.Day]
    let look: Look

    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(days.enumerated()), id: \.offset) { _, d in
                VStack(spacing: 5) {
                    Text(d.l).font(.system(size: 10, weight: d.now ? .heavy : .semibold))
                        .foregroundStyle(d.now ? look.accentText : look.secondary)
                    dot(d.s).frame(width: 8, height: 8)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.top, 9)
        .overlay(alignment: .top) { Rectangle().fill(look.line).frame(height: 1) }
    }

    @ViewBuilder func dot(_ s: String) -> some View {
        switch s {
        case "full": Circle().fill(look.accent).widgetAccentable()
        case "some": Circle().strokeBorder(look.accent, lineWidth: 1.5).widgetAccentable()
        case "none": Circle().strokeBorder(look.secondary, lineWidth: 1.5)
        case "rest": Circle().fill(look.secondary).scaleEffect(0.4)
        default: Circle().fill(look.line).scaleEffect(0.6)
        }
    }
}

// Shown when there is nothing to draw yet, or the data is from yesterday.
struct OpenApp: View {
    let line: String
    let look: Look

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Image(systemName: "circle.dashed").font(.system(size: 26, weight: .semibold)).foregroundStyle(look.accent).widgetAccentable()
            Spacer(minLength: 0)
            Text("Roj Habit").font(.system(size: 15, weight: .bold)).foregroundStyle(look.ink)
            Text(line).font(.system(size: 12)).foregroundStyle(look.secondary).lineLimit(3)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
}

struct TodayView: View {
    @Environment(\.widgetFamily) var family
    @Environment(\.widgetRenderingMode) var mode
    let entry: Entry

    var body: some View {
        let look = Look(mode)
        Group {
            if let snap = entry.snap, !entry.stale {
                switch family {
                case .systemSmall: small(snap, look)
                case .systemLarge, .systemExtraLarge: large(snap, look)
                default: medium(snap, look)
                }
            } else {
                OpenApp(line: entry.snap == nil ? "Open Roj Habit once to show your habits here." : "A new day. Open Roj Habit to load it.", look: look)
            }
        }
        .widgetURL(URL(string: "rojhabit://open"))
    }

    func date(_ text: String, _ look: Look) -> some View {
        Text(text).font(.system(size: 10, weight: .semibold)).kerning(1).foregroundStyle(look.secondary)
    }

    func nothing(_ look: Look) -> some View {
        Text("Nothing planned today.\nRest counts too.").font(.system(size: 12.5)).foregroundStyle(look.secondary)
            .multilineTextAlignment(.center).frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    // Small: one glance and one tap. The ring, the count, and the next habit to do.
    func small(_ snap: Snapshot, _ look: Look) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top) {
                Ring(snap: snap, size: 56, look: look)
                Spacer()
                date(snap.short, look)
            }
            Spacer(minLength: 6)
            Title(snap: snap, size: 16, look: look)
            if let next = snap.items.first(where: { !$0.done }) {
                Row(item: next, density: .line, look: look).frame(height: 28)
            } else {
                Text(snap.items.isEmpty ? "Rest counts too" : "Every habit checked")
                    .font(.system(size: 12)).foregroundStyle(look.secondary).frame(height: 28)
            }
        }
    }

    // Medium: the ring and count on the left, the habits on the right.
    func medium(_ snap: Snapshot, _ look: Look) -> some View {
        GeometryReader { g in
            HStack(spacing: 14) {
                VStack(spacing: 6) {
                    Ring(snap: snap, size: 74, look: look)
                    Title(snap: snap, size: 13.5, look: look)
                    date(snap.short, look)
                }
                .frame(width: 100)
                if snap.items.isEmpty {
                    nothing(look)
                } else {
                    Checklist(snap: snap, height: g.size.height, maxRows: 4, look: look)
                }
            }
        }
    }

    // Large: date and count on top with the ring, the habits, and this week at the bottom.
    func large(_ snap: Snapshot, _ look: Look) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 3) {
                    date(snap.date, look)
                    Title(snap: snap, size: 22, look: look)
                }
                Spacer()
                Ring(snap: snap, size: 54, look: look)
            }
            GeometryReader { g in
                if snap.items.isEmpty {
                    nothing(look)
                } else {
                    Checklist(snap: snap, height: g.size.height, maxRows: 8, look: look)
                }
            }
            WeekStrip(days: snap.week, look: look)
        }
    }
}

// MARK: - Widget

struct RojTodayWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "RojToday", provider: Provider()) { entry in
            TodayView(entry: entry)
                .containerBackground(for: .widget) { Palette.paper }
        }
        .configurationDisplayName("Today's habits")
        .description("Your habits for today. Click a circle to check one off.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

@main
struct RojWidgets: WidgetBundle {
    var body: some Widget {
        RojTodayWidget()
    }
}
