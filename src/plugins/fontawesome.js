import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Navigasi & Umum
import { faBars, faTimes, faChevronDown, faChevronRight, faChevronLeft, faArrowLeft, faArrowRight, faSearch, faEllipsisVertical, faCaretDown } from '@fortawesome/free-solid-svg-icons'

// User & Auth
import { faUser, faUserCircle, faUserGear, faUserGraduate, faChalkboardUser, faUsers, faUsersGear, faUsersSlash, faLock, faKey, faEye, faEyeSlash, faRightToBracket, faPowerOff, faCircleExclamation, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

// Dashboard & Chart
import { faChartPie, faChartSimple, faChartLine, faChartBar, faTable, faDatabase, faList } from '@fortawesome/free-solid-svg-icons'

// Data Master
import { faIdCard, faPersonChalkboard, faChalkboard, faBook, faGraduationCap, faSchool } from '@fortawesome/free-solid-svg-icons'

// Akademik
import { faCalendarCheck, faCalendarAlt, faCalendarDay, faCalendarPlus, faClock } from '@fortawesome/free-solid-svg-icons'
import { faBookJournalWhills, faBookOpen, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faMicroscope, faFlask, faSquarePollVertical, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

// Penilaian
import { faListCheck, faClipboardCheck, faEnvelopeOpenText, faFileSignature, faFilePen, faFileLines, faLaptopFile, faTrophy, faAward, faStar, faUpload } from '@fortawesome/free-solid-svg-icons'

// Jadwal
import { faTableCells, faSun, faMoon, faDisplay, faCloudSun, faSquareCheck, faSquareMinus } from '@fortawesome/free-solid-svg-icons'

// Aksi CRUD
import { faPlus, faEdit, faTrash, faTrashCan, faPen, faSave, faPrint, faDownload, faFilter, faFolderOpen, faCloudArrowUp, faAnglesRight, faHourglassHalf, faCheck, faCircleCheck, faCircleXmark, faCircleInfo, faQuestion, faSpinner, faGear, faBolt } from '@fortawesome/free-solid-svg-icons'

// Export/Import
import { faFileExport, faFileImport, faFileExcel, faFile } from '@fortawesome/free-solid-svg-icons'

// Lainnya
import { faHandshakeAngle, faArrowUp, faCog, faGears, faBullhorn, faHistory, faBell, faLightbulb, faQuoteRight, faVenus, faMars, faScrewdriverWrench, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'


import { faMobileScreen, faBuildingColumns, faSignature, faImage, faLink } from '@fortawesome/free-solid-svg-icons'
import { faBriefcase, faPhone, faEnvelope, faCreditCard } from '@fortawesome/free-solid-svg-icons'


//mapel

import { faHashtag, faFire, faPersonRunning, faLayerGroup, faFingerprint, faCakeCandles } from '@fortawesome/free-solid-svg-icons'
import { faVenusMars, faNoteSticky, faMapLocationDot, faDoorOpen, faCalendar, faMapPin, faCamera, faStar as faStarIcon } from '@fortawesome/free-solid-svg-icons'
import { faCrown, faUserShield } from '@fortawesome/free-solid-svg-icons'

// ============================================
// REGISTER SEMUA ICON
// ============================================
library.add(
    // Navigasi & Umum
    faBars, faTimes, faChevronDown, faChevronRight, faChevronLeft, faArrowLeft, faArrowRight, faSearch, faEllipsisVertical, faCaretDown,

    // User & Auth
    faUser, faUserCircle, faUserGear, faUserGraduate, faChalkboardUser, faUsers, faUsersGear, faUsersSlash, faLock, faKey, faEye, faEyeSlash, faRightToBracket, faPowerOff, faCircleExclamation, faTriangleExclamation,

    // Dashboard & Chart
    faChartPie, faChartSimple, faChartLine, faChartBar, faTable, faDatabase, faList,

    // Data Master
    faIdCard, faPersonChalkboard, faChalkboard, faBook, faGraduationCap, faSchool,

    // Akademik
    faCalendarCheck, faCalendarAlt, faCalendarDay, faCalendarPlus, faClock,
    faBookJournalWhills, faBookOpen, faBookmark,
    faMicroscope, faFlask, faSquarePollVertical, faPenToSquare,

    // Penilaian
    faListCheck, faClipboardCheck, faEnvelopeOpenText, faFileSignature, faFilePen, faFileLines, faLaptopFile, faTrophy, faAward, faStar, faUpload,

    // Jadwal
    faTableCells, faSun, faMoon, faDisplay, faCloudSun, faHashtag, faFire, faPersonRunning,

    // Aksi CRUD
    faPlus, faEdit, faTrash, faTrashCan, faPen, faSave, faPrint, faDownload, faFilter, faFolderOpen, faCloudArrowUp, faAnglesRight, faHourglassHalf, faCheck, faCircleCheck, faCircleXmark, faCircleInfo, faQuestion, faSpinner, faGear, faBolt,
    faCrown, faUserShield,
    // Export/Import
    faFileExport, faLink, faFileImport, faFileExcel, faFile, faMobileScreen, faBuildingColumns, faSignature, faImage, faLayerGroup, faSquareCheck, faSquareMinus,
    faVenusMars, faNoteSticky, faMapLocationDot, faDoorOpen, faCalendar, faMapPin, faCamera, faStar, faBriefcase, faPhone, faEnvelope, faCreditCard,

    // Lainnya
    faHandshakeAngle, faFingerprint, faCakeCandles, faArrowUp, faCog, faGears, faBullhorn, faHistory, faBell, faLightbulb, faQuoteRight, faVenus, faMars, faScrewdriverWrench, faFloppyDisk,
)

export default FontAwesomeIcon
