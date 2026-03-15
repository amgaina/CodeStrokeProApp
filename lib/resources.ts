import {
    FileText,
    BookOpen,
    AlertTriangle,
    Activity,
    Heart,
    Shield,
    Stethoscope,
    BookMarked,
} from "lucide-react";

const videos = [
    {
        title: "Alteplase Preparation How-to Video",
        src: "https://drive.google.com/file/d/1vnq8tkJGaXOtFM6Fbi6HsRd2XeihkQV1/preview",
        alt: "Alteplase Preparation How to Video.mp4",
    },
    {
        title: "Tenecteplase (TNK) Preparation How-to Video",
        src: "https://drive.google.com/file/d/1fBk53MLq6toy11PiGNkPlrP2McrjFg89/preview",
        alt: "TNK prep how to.mp4",
    },
];
const resources = [
    // {
    //     filename:
    //         "additional-resources--badge-buddies--and-auxilliary-labels.pdf",
    //     title: "Additional Resources and Printables",
    //     description:
    //         "Additional Resources, Badge Buddies, and auxiliary labels",
    //     category: "Printables",
    //     icon: FileText,
    // },
    {
        filename: "post-thrombolytic-monitoring.pdf",
        title: "Post-thrombolytic monitoring guidelines",
        description: "Post Thrombolytic Monitoring protocols",
        category: "Monitoring",
        icon: Activity,
    },
    {
        filename: "antihypertensives.pdf",
        title: "BP management & antihypertensive use",
        description:
            "Blood pressure management strategies and antihypertensive protocols",
        category: "Management",
        icon: Heart,
    },
    {
        filename:
            "acute-management-of-hemorrhagic-stroke-and-post-tpa-hemorrhagic-conversion.pdf",
        title: "Signs of hemorrhagic conversion Cerebral edema or ICH management",
        description:
            "Acute management of hemorrhagic stroke and post-TPA hemorrhagic conversion",
        category: "Emergency",
        icon: AlertTriangle,
    },
    {
        filename: "tpa-assocaited-angioedema-management.pdf",
        title: "Management of TPA-Induced Angioedema",
        description: "Management protocols for TPA-induced angioedema",
        category: "Emergency",
        icon: AlertTriangle,
    },
    {
        filename:
            "management-of--tia-and-patients-ineligible-for-thrombolytic-therapy-and-secondary-stroke-prevention.pdf",
        title: "Management of TIA and Patient's Ineligible For Thrombolytic Therapy and Secondary Stroke Prevention",
        description:
            "Management of TIA and secondary stroke prevention protocols",
        category: "Management",
        icon: Stethoscope,
    },
    {
        filename: "supportive-care.pdf",
        title: "Supportive Care",
        description:
            "Comprehensive supportive care protocols for stroke patients",
        category: "Care",
        icon: Shield,
    },
    // {
    //     filename:
    //         "additional-resources--badge-buddies--and-auxilliary-labels.pdf",
    //     title: "Printables",
    //     description:
    //         "Additional Resources, Badge Buddies, and auxiliary labels",
    //     category: "Printables",
    //     icon: FileText,
    // },
    {
        filename: "ems-tipsheet.pdf",
        title: "EMS Tipsheet",
        description: "Emergency medical services quick reference guide",
        category: "EMS",
        icon: Stethoscope,
    },
    {
        filename:
            "patient-education-and-counseling-for-thrombolytic-therapy.pdf",
        title: "For Patients: Patient Education and Counseling for Thrombolytic Therapy",
        description: "Patient education materials for thrombolytic therapy",
        category: "Education",
        icon: BookOpen,
    },
    {
        filename: "alteplase.pdf",
        title: "Alteplase Guidelines",
        description: "Detailed protocols for alteplase administration",
        category: "Medication",
        icon: BookMarked,
    },
    {
        filename: "tenecteplase.pdf",
        title: "Tenecteplase Guidelines",
        description: "Detailed protocols for tenecteplase administration",
        category: "Medication",
        icon: BookMarked,
    },
    {
        filename: "Thrombolytic Exlcusion and Inclusion Criteria (2026 Guideline Update).pdf",
        title: "Thrombolytic Exclusion and Inclusion Criteria",
        description: "Decision tree for thrombolytic therapy eligibility",
        category: "Assessment",
        icon: FileText,
    },
    {
        filename: "validated-stroke-assessment-tools.pdf",
        title: "Validated Stroke Assessment Tools",
        description: "Evidence-based assessment tools for stroke evaluation",
        category: "Assessment",
        icon: FileText,
    },
    {
        filename: "wake-up-stroke.pdf",
        title: "Wake-Up Stroke Protocol",
        description: "Wake-up stroke assessment and management: Quick Guide",
        category: "Essentials",
        icon: FileText,
    },
];

export { videos, resources };
