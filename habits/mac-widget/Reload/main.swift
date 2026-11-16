// Run by the Roj Habit app after it writes new data for the widget: asks WidgetKit to redraw.
import Foundation
import WidgetKit

WidgetCenter.shared.reloadAllTimelines()
// give the request a moment to leave before the process ends
RunLoop.main.run(until: Date().addingTimeInterval(0.5))
