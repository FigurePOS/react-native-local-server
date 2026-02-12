import clientEpics from "./client/epics"
import dataEpics from "./data/epics"
import serverEpics from "./server/epics"

export default [...dataEpics, ...clientEpics, ...serverEpics]
