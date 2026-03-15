"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Shield, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { PDFLink } from "../PDFLink";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EligibilityAnswers {
  underAge: boolean;
  hemorrhage: boolean;
  overTimeLimit: boolean;
  onMedications: boolean;
  contraindications: boolean;
  highBP: boolean;
  abnormalGlucose: boolean;
  rapidImprovement: boolean;
  minorSymptoms: boolean;
  recentSurgery: boolean;
  activeBleed: boolean;
  antiplateletAgents: boolean;
}

interface EligibilityScreeningProps {
  answers: EligibilityAnswers;
  onAnswerChange: (answers: EligibilityAnswers) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function EligibilityScreening({
  answers,
  onAnswerChange,
  onNext,
  onBack,
}: EligibilityScreeningProps) {
  const [medicationsExpanded, setMedicationsExpanded] = useState(true);
  const [contraindicationsExpanded, setContraindicationsExpanded] =
    useState(false);
  const [
    relativeContraindicationsExpanded,
    setRelativeContraindicationsExpanded,
  ] = useState(true);
  const [showRelativeContraDialog, setShowRelativeContraDialog] =
    useState(false);
  const [showPediatricDialog, setShowPediatricDialog] = useState(false);

  const updateAnswer = (key: keyof EligibilityAnswers, value: boolean) => {
    onAnswerChange({
      ...answers,
      [key]: value,
    });
  };

  const getEligibilityStatus = (): {
    status: "eligible" | "evaluate" | "ineligible" | "correct";
    message: string;
    color: string;
  } => {
    // Absolute contraindications - Patient NOT eligible (cannot proceed)
    if (
      answers.underAge ||
      answers.hemorrhage ||
      answers.overTimeLimit ||
      answers.activeBleed ||
      answers.recentSurgery
    ) {
      return {
        status: "ineligible",
        message: "Patient is NOT eligible for thrombolytic therapy",
        color: "red",
      };
    }

    // Correctable issues - Need to correct before considering thrombolytic
    if (answers.highBP || answers.abnormalGlucose) {
      return {
        status: "correct",
        message:
          "Correct BP or glucose levels before considering thrombolytic therapy",
        color: "amber",
      };
    }

    // Relative contraindications - Further evaluation needed to discuss risks vs benefits
    if (
      answers.onMedications ||
      answers.contraindications ||
      answers.rapidImprovement ||
      answers.minorSymptoms ||
      answers.antiplateletAgents
    ) {
      return {
        status: "evaluate",
        message:
          "Further evaluation needed to discuss risks vs benefit of thrombolytic therapy",
        color: "amber",
      };
    }

    // All criteria met - Consider thrombolytic therapy
    return {
      status: "eligible",
      message: "Consider thrombolytic therapy - All criteria met",
      color: "green",
    };
  };

  const eligibilityStatus = getEligibilityStatus();

  return (
    <Card className="mb-6 md:mb-8 clarity-shadow border border-harbor-gray bg-white">
      <CardHeader className="bg-clinical-slate text-parchment p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-medium">
          <Shield className="w-5 h-5 md:w-6 md:h-6" />
          Thrombolytic Eligibility Screening
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Absolute Contraindications */}
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
            Absolute Contraindications
          </h3>
          <p className="text-sm text-gray-600">
            Any checked box indicates a yes answer. Any yes excludes
            thrombolytic therapy.
          </p>

          {[
            {
              key: "underAge" as keyof EligibilityAnswers,
              label: "Is the patient <18 years of age?",
              showInfo: true,
            },
            {
              key: "hemorrhage" as keyof EligibilityAnswers,
              label: "Did head CT suggest or confirm any hemorrhage?",
              showInfo: false,
            },
            {
              key: "overTimeLimit" as keyof EligibilityAnswers,
              label:
                "Is the patient's last known well more than 4.5 hours ago?",
              showInfo: false,
            },
          ].map((question) => (
            <div
              key={question.key}
              className={`flex items-start space-x-3 p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${answers[question.key]
                ? "border-red-300 bg-red-50"
                : "border-gray-200"
                }`}
            >
              <Checkbox
                id={question.key}
                checked={answers[question.key]}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  const isChecked = checked === true;
                  updateAnswer(question.key, isChecked);
                  if (question.key === "underAge" && isChecked) {
                    setShowPediatricDialog(true);
                  }
                }}
                className="mt-1"
              />
              <div className="flex-1 flex items-start justify-between">
                <Label
                  htmlFor={question.key}
                  className="text-sm leading-relaxed cursor-pointer font-medium"
                >
                  {question.label}
                </Label>
              </div>
            </div>
          ))}
        </div>

        {/* Pediatric Alteplase Information Dialog */}
        <Dialog
          open={showPediatricDialog}
          onOpenChange={setShowPediatricDialog}
        >
          <DialogContent>
            <DialogHeader className="mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <DialogTitle className="text-blue-900 text-lg font-semibold">
                  Pediatric Patient - Alteplase Use
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="text-sm text-blue-800">
                While alteplase is not FDA-approved for pediatric stroke, it
                has been used off-label in select children with acute
                ischemic stroke.
              </p>
              <p className="text-sm text-blue-800">
                <strong>Use should be restricted to specialized stroke
                  centers and guided by neurology consultation.</strong>
              </p>
              <p className="text-sm text-blue-800 font-medium">
                Follow your local protocol.
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Relative Contraindications */}
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 border-b pb-2">
            Relative Contraindications
          </h3>
          <p className="text-sm text-gray-600">
            Any checked box indicates a yes answer. Require careful evaluation
            and risk-benefit analysis.
          </p>

          {/* Blood Pressure */}
          <div
            className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${answers.highBP
              ? "border-amber-300 bg-amber-50"
              : "border-gray-200"
              }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id="highBP"
                checked={answers.highBP}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  updateAnswer("highBP", checked === true)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="highBP"
                  className="text-sm font-medium cursor-pointer"
                >
                  Is BP &gt;185/110?
                </Label>
                {answers.highBP && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-700 font-medium mb-3">
                      📄 Reference Guide Available:
                    </p>
                    <div className="w-full">
                      <PDFLink
                        filename="antihypertensives.pdf"
                        title="Antihypertensives Guide"
                        variant="button"
                        showDownload={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Glucose */}
          <div
            className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${answers.abnormalGlucose
              ? "border-amber-300 bg-amber-50"
              : "border-gray-200"
              }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id="abnormalGlucose"
                checked={answers.abnormalGlucose}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  updateAnswer("abnormalGlucose", checked === true)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="abnormalGlucose"
                  className="text-sm font-medium cursor-pointer"
                >
                  Is the blood glucose less than 50 mg/dL or greater than 400
                  mg/dL?
                </Label>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div
            className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${answers.onMedications
              ? "border-amber-300 bg-amber-50"
              : "border-gray-200"
              }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id="onMedications"
                checked={answers.onMedications}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  updateAnswer("onMedications", checked === true)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label
                  htmlFor="onMedications"
                  className="text-sm font-medium cursor-pointer"
                >
                  Is the patient currently taking any of the following
                  medications?
                </Label>

                <Collapsible
                  open={medicationsExpanded}
                  onOpenChange={setMedicationsExpanded}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {medicationsExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    View Medication Details
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-3 h-3" />
                        Anticoagulants (Blood Thinners – Affect Clotting
                        Cascade)
                      </h4>

                      <div className="mb-3">
                        <h5 className="font-medium text-red-700 text-xs mb-1">
                          Oral Anticoagulants:
                        </h5>
                        <div className="space-y-1 text-xs text-red-700 ml-2">
                          <p>• Warfarin (Coumadin)</p>
                          <p>• Apixaban (Eliquis)</p>
                          <p>• Rivaroxaban (Xarelto)</p>
                          <p>• Dabigatran (Pradaxa)</p>
                          <p>• Edoxaban (Savaysa)</p>
                          <p>• Betrixaban (Bevyxxa)</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-red-700 text-xs mb-1">
                          Injectable Anticoagulants:
                        </h5>
                        <div className="space-y-1 text-xs text-red-700 ml-2">
                          <p>
                            • Enoxaparin (Lovenox) - Especially at therapeutic
                            doses
                          </p>
                          <p>• Dalteparin (Fragmin)</p>
                          <p>• Fondaparinux (Arixtra)</p>
                          <p>
                            • Heparin (unfractionated) - Particularly if aPTT is
                            elevated
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 text-sm">
                        Clinical Note
                      </h4>
                      <p className="text-xs text-blue-700">
                        Patients taking any of the above medications —
                        especially oral anticoagulants — may require additional
                        labs (INR, aPTT, anti-Xa levels) and physician
                        consultation before proceeding with thrombolytic
                        therapy.
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
          {/* Antiplatelet Agents Contraindications */}
          <div
            className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${answers.antiplateletAgents
              ? "border-amber-300 bg-amber-50"
              : "border-gray-200"
              }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id="antiplateletAgents"
                checked={answers.antiplateletAgents}
                onCheckedChange={(checked: boolean | "indeterminate") => {
                  updateAnswer("antiplateletAgents", checked === true);
                  setShowRelativeContraDialog(checked === true);
                }}
                className="mt-1"
              />
              <div className="flex-1 max-w-[80%]">
                <Label
                  htmlFor="antiplateletAgents"
                  className="text-sm font-medium cursor-pointer"
                >
                  Is the patient currently taking any of the following
                  medications?
                </Label>

                <Collapsible
                  open={relativeContraindicationsExpanded}
                  onOpenChange={setRelativeContraindicationsExpanded}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {relativeContraindicationsExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    View Antiplatelet Agent List
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 ">
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
                        Antiplatelet Agents (Not absolute contraindications but
                        clinically relevant)
                      </h4>
                      <p className="text-xs text-yellow-700 mb-2 italic">
                        These don't usually preclude thrombolytic therapy alone,
                        but combined with anticoagulants or in high-risk
                        patients, may influence bleeding risk:
                      </p>
                      <div className="space-y-1 text-xs text-yellow-700 ml-2">
                        <p>• Aspirin</p>
                        <p>• Clopidogrel</p>
                        <p>• Ticagrelor</p>
                        <p>• Prasugrel</p>
                        <p>• Dipyridamole/aspirin combo</p>
                        <p>• Cangrelor</p>
                        <p>• Ticlopidine</p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
            <Dialog
              open={showRelativeContraDialog}
              onOpenChange={setShowRelativeContraDialog}
            >
              <DialogContent>
                <DialogHeader className="mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <DialogTitle className="text-yellow-900 text-lg font-semibold">
                      Antiplatelet Agents Notice
                    </DialogTitle>
                  </div>
                </DialogHeader>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                  <div>
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      These don't usually preclude thrombolytic therapy alone,
                      <span className="block">
                        but combined with anticoagulants or in high-risk
                        patients, may influence bleeding risk:
                      </span>
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {/* Additional Contraindications - Collapsible */}
          <div
            className={`p-3 md:p-4 border-2 rounded-lg hover:border-blue-300 transition-colors ${answers.contraindications
              ? "border-amber-300 bg-amber-50"
              : "border-gray-200"
              }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id="contraindications"
                checked={answers.contraindications}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  updateAnswer("contraindications", checked === true)
                }
                className="mt-1"
              />
              <div className="flex-1 max-w-[80%]">
                <Label
                  htmlFor="contraindications"
                  className="text-sm font-medium cursor-pointer"
                >
                  Are there any known contraindications to receiving a
                  thrombolytic?
                </Label>

                <Collapsible
                  open={contraindicationsExpanded}
                  onOpenChange={setContraindicationsExpanded}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {contraindicationsExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    View Contraindication List
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 ">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="space-y-4 text-xs text-gray-700 max-h-96 overflow-y-auto pr-1">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">
                            Conditions Considered Absolute Contraindications
                          </h5>
                          <ul className="space-y-2 ml-4 list-disc">
                            <li>
                              <strong>CT with extensive hypodensity:</strong> IV
                              thrombolysis should not be administered when clear
                              hypodensity on brain imaging appears responsible
                              for clinical stroke symptoms.
                            </li>
                            <li>
                              <strong>CT with hemorrhage:</strong> Do not
                              administer IV thrombolysis when acute
                              intracranial hemorrhage is present on CT.
                            </li>
                            <li>
                              <strong>
                                Moderate to severe traumatic brain injury &lt;14
                                days:
                              </strong>{" "}
                              Likely contraindicated with recent injury,
                              especially with &gt;30 minutes of unconsciousness,
                              Glasgow Coma Scale &lt;13, or hemorrhage,
                              contusion, or skull fracture on neuroimaging.
                            </li>
                            <li>
                              <strong>Neurosurgery &lt;14 days:</strong> IV
                              thrombolysis is potentially harmful and should not
                              be administered after recent intracranial or
                              spinal surgery.
                            </li>
                            <li>
                              <strong>
                                Acute spinal cord injury within 3 months:
                              </strong>{" "}
                              IV thrombolysis is likely contraindicated.
                            </li>
                            <li>
                              <strong>Intra-axial neoplasm:</strong> IV
                              thrombolysis is potentially harmful and should not
                              be administered.
                            </li>
                            <li>
                              <strong>Infective endocarditis:</strong> Do not
                              administer IV thrombolysis in patients with AIS
                              and symptoms consistent with infective
                              endocarditis.
                            </li>
                            <li>
                              <strong>
                                Severe coagulopathy or thrombocytopenia:
                              </strong>{" "}
                              IV thrombolysis should not be administered with
                              platelets &lt;100,000/mm3, INR &gt;1.7, aPTT &gt;40
                              seconds, or PT &gt;15 seconds. In patients without
                              recent warfarin/heparin use, treatment may begin
                              before coagulation results are available, but
                              should be discontinued if INR &gt;1.7 or PT/PTT are
                              abnormal by local laboratory standards.
                            </li>
                            <li>
                              <strong>Aortic arch dissection:</strong> In known
                              or suspected aortic arch dissection, IV
                              thrombolysis is potentially harmful and should not
                              be administered.
                            </li>
                            <li>
                              <strong>
                                Amyloid-related imaging abnormalities (ARIA):
                              </strong>{" "}
                              Risk of thrombolysis-related ICH is unknown in
                              patients on amyloid immunotherapy or with ARIA;
                              IV thrombolysis should be avoided.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">
                            Conditions Considered Relative Contraindications
                          </h5>
                          <ul className="space-y-2 ml-4 list-disc">
                            <li>
                              <strong>Pre-existing disability:</strong> Benefit
                              versus risk remains uncertain and should be
                              determined individually.
                            </li>
                            <li>
                              <strong>Recent DOAC exposure (&lt;48 hours):</strong>{" "}
                              Safety is unknown; IV thrombolysis may be
                              considered after individualized risk-benefit
                              analysis, including timing of last dose, renal
                              function, stroke severity, thrombectomy
                              availability, reversal options, and assay
                              availability.
                            </li>
                            <li>
                              <strong>
                                Ischemic stroke within the prior 3 months:
                              </strong>{" "}
                              May increase risk of intracranial hemorrhage;
                              decisions should be individualized.
                            </li>
                            <li>
                              <strong>Prior ICH:</strong> May increase risk of
                              symptomatic hemorrhage. Individualized treatment
                              decisions are recommended.
                            </li>
                            <li>
                              <strong>
                                Recent major non-CNS trauma (14 days to 3
                                months):
                              </strong>{" "}
                              May increase risk of systemic hemorrhage; consider
                              surgical consultation.
                            </li>
                            <li>
                              <strong>
                                Recent major non-CNS surgery within 10 days:
                              </strong>{" "}
                              May increase harm; individual risk-benefit review
                              and surgical consultation are appropriate.
                            </li>
                            <li>
                              <strong>
                                Recent GI/GU bleeding within 21 days:
                              </strong>{" "}
                              May increase harm; consult GI/GU specialists to
                              assess whether bleeding risk is reduced.
                            </li>
                            <li>
                              <strong>Intracranial arterial dissections:</strong>{" "}
                              Safety of IV thrombolysis is unknown.
                            </li>
                            <li>
                              <strong>
                                Intracranial vascular malformations:
                              </strong>{" "}
                              Safety in unruptured or untreated lesions is
                              unknown.
                            </li>
                            <li>
                              <strong>Recent STEMI within 3 months:</strong>{" "}
                              Requires individualized risk-benefit assessment
                              and emergent cardiology consultation.
                            </li>
                            <li>
                              <strong>Acute pericarditis:</strong> May be
                              reasonable in severe disabling AIS with emergent
                              cardiology consultation.
                            </li>
                            <li>
                              <strong>
                                Left atrial or ventricular thrombus:
                              </strong>{" "}
                              May be reasonable in severe disabling AIS with
                              emergent cardiology consultation.
                            </li>
                            <li>
                              <strong>Systemic active malignancy:</strong>{" "}
                              Safety is unknown; emergent oncology consultation
                              and individualized risk-benefit analysis are
                              warranted.
                            </li>
                            <li>
                              <strong>Pregnancy and post-partum period:</strong>{" "}
                              May be considered when benefits for moderate or
                              severe stroke outweigh uterine bleeding risk;
                              emergent obstetrical consultation is warranted.
                            </li>
                            <li>
                              <strong>Dural puncture within 7 days:</strong> May
                              be considered in individual AIS cases.
                            </li>
                            <li>
                              <strong>Arterial puncture within 7 days:</strong>{" "}
                              Safety is unknown after noncompressible vessel
                              puncture in the preceding 7 days.
                            </li>
                            <li>
                              <strong>
                                Moderate to severe traumatic brain injury 14
                                days to 3 months:
                              </strong>{" "}
                              May be considered with careful multidisciplinary
                              consultation.
                            </li>
                            <li>
                              <strong>
                                Neurosurgery 14 days to 3 months:
                              </strong>{" "}
                              May be considered on an individual basis with
                              neurosurgical consultation.
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">
                            Conditions Where Benefits Generally Outweigh
                            Bleeding Risk
                          </h5>
                          <ul className="space-y-2 ml-4 list-disc">
                            <li>
                              <strong>Extracranial cervical dissections:</strong>{" "}
                              IV thrombolysis appears reasonably safe within 4.5
                              hours and is likely recommended.
                            </li>
                            <li>
                              <strong>
                                Extra-axial intracranial neoplasms:
                              </strong>{" "}
                              Risk appears low and treatment should be
                              considered.
                            </li>
                            <li>
                              <strong>Angiographic procedural stroke:</strong>{" "}
                              Benefit likely outweighs risk and treatment should
                              be considered.
                            </li>
                            <li>
                              <strong>
                                Unruptured intracranial aneurysm:
                              </strong>{" "}
                              Risk appears low and treatment should be
                              considered.
                            </li>
                            <li>
                              <strong>History of GI/GU bleeding:</strong> Remote
                              stable history may still permit IV thrombolysis
                              after individualized review and GI/GU
                              consultation.
                            </li>
                            <li>
                              <strong>History of MI:</strong> Remote MI history
                              generally has greater benefit than risk.
                            </li>
                            <li>
                              <strong>Recreational drug use:</strong> In most
                              patients, benefit likely outweighs risk.
                            </li>
                            <li>
                              <strong>
                                Uncertain diagnosis / stroke mimics:
                              </strong>{" "}
                              Unless absolute contraindications are present,
                              harm risk is low and benefit likely outweighs
                              risk.
                            </li>
                            <li>
                              <strong>Moyamoya:</strong> Current evidence does
                              not suggest increased ICH risk, and benefit likely
                              outweighs risk.
                            </li>
                          </ul>
                        </div>

                        <p className="text-[11px] text-gray-600 italic border-t border-gray-200 pt-3">
                          Disclaimer: This document is intended for guidance
                          purposes only. Clinical decisions must always be made
                          in accordance with current clinical guidelines, local
                          policies and protocols, and the professional
                          judgment and discretion of the treating clinician.
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <p className="text-sm text-blue-700 font-medium mb-3">
                          📄 Clinical Reference Guide:
                        </p>
                        <div className="w-full">
                          <PDFLink
                            filename="Thrombolytic Exlcusion and Inclusion Criteria (2026 Guideline Update).pdf"
                            title="Inclusion & Exclusion Criteria Decision Tree"
                            variant="button"
                            showDownload={true}
                          />
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Status */}
        <Alert
          className={`${eligibilityStatus.status === "ineligible"
            ? "border-critical-crimson/70 bg-critical-crimson/20"
            : eligibilityStatus.status === "evaluate" ||
              eligibilityStatus.status === "correct"
              ? "border-urgent-amber/70 bg-urgent-amber/20"
              : "border-vital-green/70 bg-vital-green/20"
            }`}
        >
          <AlertTriangle
            className={`h-5 w-5 ${eligibilityStatus.status === "ineligible"
              ? "text-critical-crimson"
              : eligibilityStatus.status === "evaluate" ||
                eligibilityStatus.status === "correct"
                ? "text-urgent-amber-dark"
                : "text-vital-green-dark"
              }`}
          />
          <AlertDescription className="font-medium">
            <strong
              className={`${eligibilityStatus.status === "ineligible"
                ? "text-critical-crimson"
                : eligibilityStatus.status === "evaluate" ||
                  eligibilityStatus.status === "correct"
                  ? "text-urgent-amber-dark"
                  : "text-vital-green-dark"
                }`}
            >
              Assessment:
            </strong>{" "}
            {eligibilityStatus.message}
            {eligibilityStatus.status === "ineligible" && (
              <>
                <br />
                <span className="text-sm text-critical-crimson mt-2 block">
                  Absolute contraindication(s) present. Do not proceed with IV
                  thrombolytic therapy.
                </span>
              </>
            )}
            {eligibilityStatus.status === "evaluate" && (
              <>
                <br />
                <span className="text-sm text-urgent-amber-dark mt-2 block">
                  Relative risk factor(s) present. Continue only after
                  individualized risk-benefit review.
                </span>
              </>
            )}
            {eligibilityStatus.status === "correct" && (
              <>
                <br />
                <span className="text-sm text-urgent-amber-dark mt-2 block">
                  <strong>Action Required:</strong> Address BP (&gt;185/110) or
                  glucose levels (&lt;50 or &gt;400 mg/dL) before proceeding
                  with thrombolytic consideration.
                </span>
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto"
              name="backToTimers"
            >
              Back to Timers
            </Button>
          )}
          <Button
            onClick={() => {
              if (
                eligibilityStatus.status === "eligible" ||
                eligibilityStatus.status === "evaluate"
              ) {
                onNext();
              }
            }}
            disabled={
              eligibilityStatus.status === "ineligible" ||
              eligibilityStatus.status === "correct"
            }
            name="continueToDrugSelection"
            className={`text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto ${eligibilityStatus.status === "ineligible" ||
              eligibilityStatus.status === "correct"
              ? "bg-harbor-gray-dark text-white cursor-not-allowed"
              : eligibilityStatus.status === "evaluate"
                ? "bg-urgent-amber-dark hover:bg-urgent-amber/90 text-white"
                : "bg-vital-green-dark hover:bg-vital-green/90 text-white"
              }`}
          >
            {eligibilityStatus.status === "ineligible"
              ? "Patient Not Eligible - Cannot Proceed"
              : eligibilityStatus.status === "correct"
                ? "Correct Issues Before Proceeding"
                : eligibilityStatus.status === "evaluate"
                  ? "Continue with Caution - Evaluation Needed"
                  : "Continue to Drug Selection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
