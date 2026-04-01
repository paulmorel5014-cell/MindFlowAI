// ─── Customization Flow ───────────────────────────────────────
// Handles multi-step modifier selection for menu items

function buildCustomizationFlow(item) {
  const steps = [];

  for (const modifier of item.modifiers || []) {
    if (modifier.choices.length > 0) {
      steps.push({
        modifierId: modifier.id,
        modifierName: modifier.name,
        type: modifier.type,
        required: modifier.required,
        minChoices: modifier.minChoices || 0,
        maxChoices: modifier.maxChoices || modifier.choices.length,
        choices: modifier.choices,
        selectedChoices: [],
      });
    }
  }

  return steps;
}

function formatModifierStep(step, itemName) {
  let text = `*${itemName}*\n`;
  text += `\n🔧 *${step.modifierName}*\n`;

  if (step.required) {
    text += `_(obligatoire`;
    if (step.type === 'multiple') {
      text += `, choisissez ${step.minChoices}-${step.maxChoices}`;
    }
    text += `)_\n`;
  } else {
    text += `_(optionnel)_\n`;
  }

  text += '\n';
  step.choices.forEach((choice, i) => {
    text += `${i + 1}. ${choice.name}`;
    if (choice.price > 0) {
      text += ` (+${formatPrice(choice.price)})`;
    }
    text += '\n';
  });

  if (!step.required) {
    text += `0. Passer cette étape\n`;
  }

  return text;
}

function parseModifierChoice(input, step) {
  const trimmed = input.trim();

  // Skip
  if (trimmed === '0' && !step.required) {
    return { valid: true, selectedChoices: [] };
  }

  if (step.type === 'single') {
    const index = parseInt(trimmed) - 1;
    if (isNaN(index) || index < 0 || index >= step.choices.length) {
      return {
        valid: false,
        error: `Veuillez choisir un numéro entre 1 et ${step.choices.length}`,
      };
    }
    return { valid: true, selectedChoices: [step.choices[index]] };
  }

  // Multiple selection: "1,2,3" or "1 2 3"
  const parts = trimmed
    .split(/[,\s]+/)
    .map(p => parseInt(p.trim()) - 1)
    .filter(i => !isNaN(i));

  if (parts.length < step.minChoices) {
    return {
      valid: false,
      error: `Choisissez au moins ${step.minChoices} option(s)`,
    };
  }

  if (step.maxChoices && parts.length > step.maxChoices) {
    return {
      valid: false,
      error: `Maximum ${step.maxChoices} option(s) autorisé(es)`,
    };
  }

  const invalid = parts.filter(i => i < 0 || i >= step.choices.length);
  if (invalid.length > 0) {
    return {
      valid: false,
      error: `Numéro(s) invalide(s): ${invalid.map(i => i + 1).join(', ')}`,
    };
  }

  return {
    valid: true,
    selectedChoices: parts.map(i => step.choices[i]),
  };
}

function applyModifierChoice(steps, stepIndex, selectedChoices) {
  return steps.map((step, i) => {
    if (i === stepIndex) {
      return { ...step, selectedChoices };
    }
    return step;
  });
}

function getNextIncompleteStep(steps) {
  return steps.findIndex(
    step => step.required && step.selectedChoices.length === 0
  );
}

function buildSelectedModifiers(completedSteps) {
  return completedSteps
    .filter(step => step.selectedChoices.length > 0)
    .map(step => ({
      modifierId: step.modifierId,
      modifierName: step.modifierName,
      selectedChoices: step.selectedChoices,
    }));
}

function formatPrice(cents) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

module.exports = {
  buildCustomizationFlow,
  formatModifierStep,
  parseModifierChoice,
  applyModifierChoice,
  getNextIncompleteStep,
  buildSelectedModifiers,
};
