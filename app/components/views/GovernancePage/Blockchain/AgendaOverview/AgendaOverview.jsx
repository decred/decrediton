import Overview from "./Overview/Overview";
import AgendaCard from "./AgendaCard/AgendaCard";
import { useState, useEffect, useMemo } from "react";

const AgendaOverview = ({
  selectedChoice,
  disabled,
  agenda,
  onCloseAgenda,
  showVoteChoice,
  onClick,
  onUpdateVotePreference
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState(selectedChoice);
  useEffect(() => {
    if (selectedChoice !== selectedChoiceId) {
      setSelectedChoiceId(selectedChoice);
    }
  }, [selectedChoice, selectedChoiceId]);

  const hasModifiedChoice = () => selectedChoiceId !== selectedChoice;

  const updatePreferences = () => {
    if (!hasModifiedChoice()) return;
    onUpdateVotePreference(agenda.name, selectedChoiceId);
  };
  const agendaChoices = agenda.choices;
  const choices = useMemo(
    () =>
      agendaChoices.map((choice) => ({
        choiceId: choice.getId()
      })),
    [agendaChoices]
  );
  return showVoteChoice ? (
    <Overview
      {...{
        isFinished: agenda.finished,
        agendaId: agenda.name,
        agendaDescription: agenda.description,
        passed: agenda.passed,
        selectedChoiceId,
        activeChoiceId: selectedChoice,
        hasModifiedChoice,
        choices,
        setSelectedChoiceId,
        updatePreferences,
        closeCurrentAgenda: onCloseAgenda,
        disabled
      }}
    />
  ) : (
    <AgendaCard {...{ onClick, agenda, selectedChoice }} />
  );
};

export default AgendaOverview;
