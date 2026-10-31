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
    var pct: Int { items.isEmpty ? 0 : Int((Double(done) / Double(items.count) * 100).rounded()) }

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

enum Palette {
    static func dynamic(_ light: NSColor, _ dark: NSColor) -> Color {
        Color(nsColor: NSColor(name: nil) { $0.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua ? dark : light })
    }
    static let paper = dynamic(NSColor(red: 0.988, green: 0.980, blue: 0.965, alpha: 1), NSColor(red: 0.102, green: 0.106, blue: 0.125, alpha: 1))
    static let ink = dynamic(NSColor(red: 0.090, green: 0.094, blue: 0.106, alpha: 1), NSColor(red: 0.949, green: 0.945, blue: 0.933, alpha: 1))
    static let secondary = dynamic(NSColor(red: 0.467, green: 0.451, blue: 0.420, alpha: 1), NSColor(red: 0.565, green: 0.553, blue: 0.529, alpha: 1))
    static let accent = dynamic(NSColor(red: 0.910, green: 0.588, blue: 0.180, alpha: 1), NSColor(red: 0.949, green: 0.651, blue: 0.271, alpha: 1))
    static let accentText = dynamic(NSColor(red: 0.659, green: 0.357, blue: 0.047, alpha: 1), NSColor(red: 0.961, green: 0.710, blue: 0.396, alpha: 1))
    static let line = dynamic(NSColor(white: 0, alpha: 0.08), NSColor(white: 1, alpha: 0.10))
}

extension Color {
    init(hex: String) {
        let v = UInt64(hex.trimmingCharacters(in: CharacterSet(charactersIn: "#")), radix: 16) ?? 0x4C84BC
        self.init(red: Double((v >> 16) & 0xFF) / 255, green: Double((v >> 8) & 0xFF) / 255, blue: Double(v & 0xFF) / 255)
    }
}

// One piece of ring per habit, filling in marigold as it gets done, like the app's Today.
struct SegRing: View {
    let fracs: [Double]
    let width: CGFloat

    var body: some View {
        let n = max(fracs.count, 1)
        let gap = fracs.count > 1 ? min(0.04, 0.5 / Double(n)) : 0
        let seg = 1.0 / Double(n) - gap
        ZStack {
            ForEach(0..<n, id: \.self) { i in
                let start = Double(i) / Double(n) + gap / 2
                Circle().trim(from: start, to: start + seg)
                    .stroke(Palette.accent.opacity(0.22), style: StrokeStyle(lineWidth: width, lineCap: .round))
                if i < fracs.count, fracs[i] > 0 {
                    Circle().trim(from: start, to: start + seg * fracs[i])
                        .stroke(Palette.accent, style: StrokeStyle(lineWidth: width, lineCap: .round))
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

    var body: some View {
        ZStack {
            SegRing(fracs: snap.items.map(\.frac), width: size * 0.11)
            HStack(alignment: .firstTextBaseline, spacing: 0) {
                Text("\(snap.pct)").font(.system(size: size * 0.27, weight: .bold, design: .rounded))
                Text("%").font(.system(size: size * 0.15, weight: .semibold, design: .rounded)).foregroundStyle(Palette.secondary)
            }
            .foregroundStyle(Palette.ink)
            .monospacedDigit()
        }
        .frame(width: size, height: size)
    }
}

// The check circle: an outline in the habit's colour, a partly drawn ring for counts, filled with a tick when done.
struct Bubble: View {
    let item: Snapshot.Item

    var body: some View {
        let c = Color(hex: item.color)
        ZStack {
            if item.done {
                Circle().fill(c)
                Image(systemName: "checkmark").font(.system(size: 8.5, weight: .heavy)).foregroundStyle(.white)
            } else if item.frac > 0 {
                Circle().stroke(c.opacity(0.25), lineWidth: 1.8)
                Circle().trim(from: 0, to: item.frac).stroke(c, style: StrokeStyle(lineWidth: 1.8, lineCap: .round)).rotationEffect(.degrees(-90))
                Text("\(item.count)").font(.system(size: 8.5, weight: .bold, design: .rounded)).foregroundStyle(Palette.ink)
            } else {
                Circle().stroke(c.opacity(0.75), lineWidth: 1.8)
            }
        }
        .frame(width: 18, height: 18)
    }
}

struct Row: View {
    let item: Snapshot.Item

    var body: some View {
        Button(intent: ToggleHabit(id: item.id)) {
            HStack(spacing: 10) {
                Bubble(item: item)
                Text(item.name)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(item.done ? Palette.secondary : Palette.ink)
                    .lineLimit(1)
                Spacer(minLength: 4)
                if let meta = item.meta {
                    Text(meta).font(.system(size: 11, weight: .semibold)).foregroundStyle(Palette.secondary).monospacedDigit()
                }
            }
            .frame(maxHeight: .infinity)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

// "2 of 5 done", with the done count in marigold.
struct Title: View {
    let snap: Snapshot
    let size: CGFloat

    var body: some View {
        Group {
            if snap.items.isEmpty {
                Text("Nothing today")
            } else if snap.done == snap.items.count {
                Text("All done")
            } else {
                Text("\(snap.done)").foregroundColor(Palette.accentText) + Text(" of \(snap.items.count) done")
            }
        }
        .font(.system(size: size, weight: .bold))
        .foregroundStyle(Palette.ink)
        .lineLimit(1)
        .minimumScaleFactor(0.8)
    }
}

// Open habits first; rows share the height. With more habits than fit, the last row says how many more.
struct Checklist: View {
    let snap: Snapshot
    let slots: Int

    var body: some View {
        let more = snap.items.count > slots
        let shown = Array(snap.items.prefix(more ? slots - 1 : slots))
        VStack(alignment: .leading, spacing: 0) {
            ForEach(shown) { Row(item: $0) }
            if more {
                Text("+\(snap.items.count - shown.count) more")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(Palette.secondary)
                    .padding(.leading, 28)
                    .frame(maxHeight: .infinity)
            }
            if !more && shown.count < slots && shown.count <= slots / 2 { Spacer(minLength: 0) }
        }
    }
}

struct WeekStrip: View {
    let days: [Snapshot.Day]

    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(days.enumerated()), id: \.offset) { _, d in
                VStack(spacing: 5) {
                    Text(d.l).font(.system(size: 10, weight: d.now ? .bold : .semibold))
                        .foregroundStyle(d.now ? Palette.accentText : Palette.secondary)
                    dot(d.s).frame(width: 8, height: 8)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.top, 8)
        .overlay(alignment: .top) { Rectangle().fill(Palette.line).frame(height: 1) }
    }

    @ViewBuilder func dot(_ s: String) -> some View {
        switch s {
        case "full": Circle().fill(Palette.accent)
        case "some": Circle().strokeBorder(Palette.accent, lineWidth: 1.5)
        case "none": Circle().strokeBorder(Palette.secondary.opacity(0.6), lineWidth: 1.5)
        case "rest": Circle().fill(Palette.secondary.opacity(0.35)).scaleEffect(0.45)
        default: Circle().fill(Palette.line).scaleEffect(0.6)
        }
    }
}

// Shown when there is nothing to draw yet, or the data is from yesterday.
struct OpenApp: View {
    let line: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Image(systemName: "circle.dashed").font(.system(size: 26, weight: .semibold)).foregroundStyle(Palette.accent)
            Spacer(minLength: 0)
            Text("Roj Habit").font(.system(size: 15, weight: .bold)).foregroundStyle(Palette.ink)
            Text(line).font(.system(size: 12)).foregroundStyle(Palette.secondary).lineLimit(3)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    }
}

struct TodayView: View {
    @Environment(\.widgetFamily) var family
    let entry: Entry

    var body: some View {
        Group {
            if let snap = entry.snap, !entry.stale {
                switch family {
                case .systemSmall: small(snap)
                case .systemLarge, .systemExtraLarge: large(snap)
                default: medium(snap)
                }
            } else {
                OpenApp(line: entry.snap == nil ? "Open Roj Habit once to show your habits here." : "A new day. Open Roj Habit to load it.")
            }
        }
        .widgetURL(URL(string: "rojhabit://open"))
    }

    func small(_ snap: Snapshot) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top) {
                Ring(snap: snap, size: 50)
                Spacer()
                Text(snap.short).font(.system(size: 10, weight: .semibold)).kerning(1).foregroundStyle(Palette.secondary)
            }
            Spacer(minLength: 6)
            Title(snap: snap, size: 16)
            if let next = snap.items.first(where: { !$0.done }) {
                Row(item: next).frame(height: 26)
            } else {
                Text(snap.items.isEmpty ? "Rest counts too" : "Every habit checked")
                    .font(.system(size: 12)).foregroundStyle(Palette.secondary).frame(height: 26)
            }
        }
    }

    func medium(_ snap: Snapshot) -> some View {
        HStack(spacing: 16) {
            VStack(spacing: 4) {
                Ring(snap: snap, size: 70)
                Title(snap: snap, size: 13).padding(.top, 4)
                Text(snap.short).font(.system(size: 9.5, weight: .semibold)).kerning(1).foregroundStyle(Palette.secondary)
            }
            .frame(width: 96)
            if snap.items.isEmpty {
                Text("Nothing planned today. Rest counts too.").font(.system(size: 12)).foregroundStyle(Palette.secondary)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                Checklist(snap: snap, slots: 4)
            }
        }
    }

    func large(_ snap: Snapshot) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(snap.date).font(.system(size: 10.5, weight: .semibold)).kerning(1).foregroundStyle(Palette.secondary)
                    Title(snap: snap, size: 21)
                }
                Spacer()
                Ring(snap: snap, size: 50)
            }
            if snap.items.isEmpty {
                Text("Nothing planned today. Rest counts too.").font(.system(size: 13)).foregroundStyle(Palette.secondary)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                Checklist(snap: snap, slots: 7)
            }
            WeekStrip(days: snap.week)
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
