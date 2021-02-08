import Overview from "./Overview";
import AgendaCard from "./AgendaCard";
import { useState, useEffect, useMemo } from "react";

const AgendaOverview = ({
  selectedChoice,
  disabled,
  agenda,
  onCloseAgenda,
  showVoteChoice,
  onClick,
  onUpdateVotePreference,
  isLoading
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState(selectedChoice);
  useEffect(() => {
    if (selectedChoice !== selectedChoiceId) {
      setSelectedChoiceId(selectedChoiceId);
    }
  }, [selectedChoice, selectedChoiceId]);

  const updatePreferences =  async (passphrase) => {
    await onUpdateVotePreference(agenda.name, selectedChoiceId, passphrase);
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
        choices,
        setSelectedChoiceId,
        updatePreferences,
        closeCurrentAgenda: onCloseAgenda,
        disabled,
        isLoading
      }}
    />
  ) : (
    <AgendaCard {...{ onClick, agenda, selectedChoice }} />
  );
};

export default AgendaOverview;
