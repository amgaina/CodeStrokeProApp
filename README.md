# CodeStrokePro - User Guide

This document provides simple guidance on using, updating, and maintaining the CodeStrokePro website. It's written for non-technical users who need to manage website content.

## Table of Contents

-   [Introduction](#introduction)
-   [Website Features](#website-features)
-   [Website Structure](#website-structure)
-   [Making Content Updates](#making-content-updates)
-   [Adding New Resources](#adding-new-resources)
-   [Website Branding](#website-branding)
-   [Getting Help](#getting-help)
-   [Technical Support Information](#technical-support-information)
-   [Calculations and Formulas](#calculations-and-formulas)

## Introduction

CodeStrokePro is a clinical decision support website designed to help healthcare providers deliver better stroke care. This guide will help you understand how the website works and how to make simple updates without needing technical expertise.

## Website Features

CodeStrokePro offers several important tools for healthcare providers:

-   **Calculator Tool**: Helps calculate proper medication dosages and timing for stroke treatment
-   **Quick Reference Guides**: Easy-to-access clinical resources and guidelines
-   **Patient Screening**: Tools to determine if patients are eligible for specific treatments
-   **Medication Dosing**: Simple calculators for thrombolytic drug dosing
-   **Educational Materials**: Resources for healthcare provider education

## Website Structure

The CodeStrokePro website has several main sections:

1. **Home Page**: Introduction to the website and its purpose
2. **Calculator**: The main tool for stroke treatment timing and dosing
3. **Quick Calc**: A simplified version of the calculator for fast use
4. **About Page**: Information about the website and its creators
5. **Resources Page**: Collection of clinical PDFs and reference materials

### Important Website Areas

As a content manager, you'll primarily work with:

-   **PDF Resources**: Located in the `public/pdfs` folder
-   **Images & Logos**: Located in the `public/logo` and `assets` folders
-   **Resource Listings**: Information about resources is stored in a file called `resources.ts`

### Main Pages

Here are the important pages users will see:

1. **Homepage** - The first page visitors see
2. **Calculator Page** - The main clinical decision tool with several steps:
    - Last Known Well (LKW) time entry
    - Time tracking for treatment windows
    - Patient eligibility screening
    - Medication selection
    - Dosing calculation
3. **Resources Page** - Access to clinical PDFs and reference materials

## Website Branding

CodeStrokePro follows a consistent visual style called the "Clarity Protocol" design system. Understanding this will help you maintain a consistent look when adding new content.

### Colors

The website uses specific colors that each have a purpose:

-   **Light Cream (#F7F7F5)**: Main background color
-   **Dark Gray (#2E3A40)**: Main text color
-   **Blue-Gray (#3A506B)**: Buttons and interactive elements
-   **Light Gray (#BCC5CE)**: Secondary elements and borders
-   **Green (#2A9D8F)**: Success messages and positive indicators
-   **Amber (#E9C46A)**: Warning messages and caution indicators
-   **Red (#D62828)**: Critical alerts and error messages

When creating new content, try to use these colors rather than introducing new ones.

### Text Styles

The website uses the "Inter" font throughout. Text sizes are standardized:

-   **Large Headings**: 36px, semi-bold
-   **Medium Headings**: 24px, medium weight
-   **Small Headings**: 18px, semi-bold
-   **Regular Text**: 16px, regular weight

### Visual Elements

All elements on the website follow a consistent style:

-   Rounded corners on cards and buttons
-   Light shadows to create depth
-   Clear spacing between elements
-   Consistent button styles across pages

## Making Content Updates

As a non-technical content manager, you'll primarily be updating PDF resources and basic information. Here's how to handle common tasks:

### Updating PDF Resources

To update an existing PDF:

1. Find the PDF file you want to replace in the `public/pdfs` folder
2. Create a backup of the original file by saving a copy elsewhere
3. Rename your new PDF to exactly match the old file name
4. Replace the old file with your new file
5. Test the website to ensure the link works correctly

> **Important**: Always keep the same filename when replacing PDFs to avoid breaking links

### Updating Website Text

For simple text changes, you'll need to contact your developer. The text is embedded in the code files and requires technical knowledge to update.

### Adding New Images

To add new images:

1. Make sure your image is optimized for web (ideally under 200KB)
2. Place the image in the appropriate folder:
    - Logos go in `public/logo`
    - General images go in `assets`
3. Contact your developer to help add the image to the website pages

## Publishing Updates

After making any changes to files:

1. Test the website thoroughly to ensure everything works
2. Contact your technical support person to deploy the changes
3. They will run a special command to update the live website:
    ```
    vercel deploy --prod
    ```

> **Note**: Only someone with technical access can publish updates to the live website

## Adding New Resources

### Adding New PDF Resources

To add a completely new PDF resource:

1. **Prepare your PDF file**:

    - Make sure the file is properly formatted
    - Use a descriptive filename with no spaces (use hyphens instead)
    - Example: `new-treatment-guideline.pdf` (not "New Treatment Guideline.pdf")

2. **Add the PDF to the website**:

    - Place your PDF file in the `public/pdfs` folder

3. **Update the resource listing**:
    - You'll need technical help for this step
    - The developer will need to update a file called `lib/resources.ts`
    - They'll add information about your resource using this format:

```
{
    filename: "new-treatment-guideline.pdf",
    title: "New Treatment Guideline",
    description: "Description of the new treatment guideline",
    category: "Guidelines",
    icon: FileText,  // This is the icon type
}
```

### Updating Website Content

For other content updates such as:

-   Changing text on the homepage
-   Adding new features to the calculator
-   Modifying how the site works

You'll need to contact your developer. These changes require technical knowledge of React, Next.js, and JavaScript.

### Regular Website Maintenance

To keep the website running smoothly:

1. **Check all links regularly** to ensure PDFs are still accessible
2. **Test the calculator functionality** with sample cases
3. **Review clinical content** periodically for accuracy
4. **Keep a backup** of all PDF resources in case they need to be restored

## Getting Help

If you encounter problems or need to make changes beyond simple PDF updates:

### Common Issues

1. **PDF not showing up on the Resources page**

    - Check that the filename exactly matches what's in the resources list
    - Make sure the PDF is in the correct folder (`public/pdfs`)
    - Verify the PDF isn't corrupted by opening it directly

2. **Calculator not working correctly**

    - This requires technical help - contact your developer
    - Provide specific details about what's not working
    - Include screenshots if possible

3. **Website appears broken**
    - Try clearing your browser cache (Ctrl+F5 or Cmd+Shift+R)
    - Try a different browser
    - Contact your developer if the problem persists

### When to Contact Technical Support

Contact your technical support person when:

-   You need to add new PDFs to the resources listing
-   Text on the website needs to be updated
-   The calculator behavior needs to be modified
-   You see error messages or broken elements on the site
-   You need to update the website with new clinical guidelines

## Technical Support Information

Keep this information handy for when you need technical help:

-   **Website Platform**: Next.js (version 15.2.4)
-   **Hosting Service**: Vercel
-   **Repository**: GitHub - CodeStrokeProApp (owner: amgaina)
-   **Branch**: dev/screening_page

When contacting support, always include:

1. Clear description of what you're trying to do
2. Screenshots of any errors or issues
3. Which page you're working with
4. Any files you're trying to update

## Calculations and Formulas

This section explains the key calculations and medical formulas used in the CodeStrokePro application. Understanding these will help you verify the calculator is working correctly and explain the results to users. These are the specific mathematical details and clinical conventions used throughout the application.

### Time Calculations

Time-based calculations are critical for stroke treatment decisions:

#### 1. Last Known Well (LKW) Window

The system calculates the 4.5-hour window from the last known well time:

```
4.5 Hour Limit = LKW Time + (4.5 * 60 * 60 * 1000 milliseconds)
```

This represents the standard treatment window for IV thrombolytics.

#### 2. Door-to-Needle Time

The system calculates elapsed time since ED arrival:

```
Elapsed Time = Current Time - Arrival Time
```

This is displayed in hours:minutes:seconds format to track the critical door-to-needle time.

#### 3. Time Format Conversion

Times are displayed in standard HH:MM:SS format using these calculations:

```
Hours = Math.floor(milliseconds / 3,600,000)
Minutes = Math.floor((milliseconds % 3,600,000) / 60,000)
Seconds = Math.floor((milliseconds % 60,000) / 1,000)
```

### Medication Dosing Calculations

#### 1. Tenecteplase (TNK) Dosing

TNK is dosed based on weight tiers:

| Patient Weight | Total Dose | Volume to Administer |
| -------------- | ---------- | -------------------- |
| < 60 kg        | 15 mg      | 3.0 mL               |
| 60-69 kg       | 17.5 mg    | 3.5 mL               |
| 70-79 kg       | 20 mg      | 4.0 mL               |
| 80-89 kg       | 22.5 mg    | 4.5 mL               |
| ≥ 90 kg        | 25 mg      | 5.0 mL               |

#### 2. Alteplase (tPA) Dosing

Alteplase is dosed based on weight with a maximum cap:

```
Total Dose (mg) = Min(Patient Weight in kg * 0.9, 90)
```

This is administered as:

-   10% as bolus: `Bolus Dose = Total Dose * 0.1`
-   90% as infusion: `Infusion Dose = Total Dose * 0.9`

#### 3. Weight Conversion

When weight is entered in pounds, it's converted to kilograms:

```
Weight in kg = Weight in lbs * 0.453592
```

#### 4. Waste Calculation

The system calculates medication waste to document:

```
Waste (mg) = Vial Size (mg) - Total Dose (mg)
```

For TNK, waste volume is calculated as:

```
Waste Volume (mL) = Waste (mg) / 5
```

For Alteplase, waste volume equals waste in mg (as concentration is 1 mg/mL).

### Medical Conventions

The application follows these medical conventions:

1. **Weight Range Validation**: Patient weight must be between 5-300 kg
2. **Maximum tPA Dose**: 90 mg regardless of patient weight
3. **Time Window**: Standard 4.5-hour window from LKW for IV thrombolytic eligibility
4. **Units**: All medication doses are in milligrams (mg)
5. **Precision**: All calculations display to one decimal place (0.0)

### Eligibility Screening Logic

The eligibility screening module uses Boolean logic to determine if a patient is eligible for thrombolytic therapy:

#### Absolute Contraindications

Any "YES" answer to these questions makes a patient ineligible:

-   Patient < 18 years of age
-   Hemorrhage on CT/MRI
-   Last-known-well > 4.5 hours ago
-   Active anticoagulant / high-risk antiplatelet therapy
-   Blood pressure > 185/110 mmHg
-   Glucose < 50 or > 400 mg/dL
-   Other major contraindications (detailed in the application)

#### Correctable Contraindications

These can be corrected before proceeding:

-   High blood pressure (antihypertensive protocols provided)
-   Abnormal glucose levels (correction protocols)

#### Reference Values

All clinical thresholds used in the application follow the latest AHA/ASA guidelines for acute ischemic stroke management:

-   BP threshold: 185/110 mmHg
-   Glucose thresholds: < 50 mg/dL or > 400 mg/dL
-   Treatment window: 4.5 hours from last known well time

### PDF Generation

The application can generate PDF dosing cards using the following process:

1. The `jsPDF` library is used to create PDF documents
2. Font settings: Helvetica, sizes ranging from 10-18px
3. PDF structure:
    - Header with title
    - Drug information section
    - Dosing instructions
    - Waste documentation section
    - Warning message
    - Footer with timestamp
4. PDF naming convention: `stroke-dosing-{drugType}-{date}.pdf`

### Naming Conventions

The codebase follows these naming conventions:

1. **Variables**:

    - Time-related variables: `lkwTime`, `arrivalTime`, `currentTime`
    - Drug-related variables: `selectedDrug`, `vialSize`, `totalDose`
    - Patient-related variables: `ptWeight`, `weightUnit`

2. **File Names**:

    - Component files: PascalCase (e.g., `DosingCalculator.tsx`)
    - PDF resources: kebab-case (e.g., `antihypertensives.pdf`)
    - Utility files: camelCase (e.g., `resources.ts`)

3. **CSS Classes**:
    - Color utilities: `text-clinical-slate`, `bg-vital-green`
    - Spacing utilities: `space-y-4`, `gap-3`
    - Status indicators: `border-critical-crimson`

---

This guide provides basic information for managing the CodeStrokePro website. For technical assistance, please contact your development team.
