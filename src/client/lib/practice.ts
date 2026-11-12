export function typeLabel(mode: string, type?: string | null): string {
  if (!type) return '';
  if (mode === 'multiplication') {
    if (type === '1_digit') return '1-digit multiplier';
    if (type === '2_digit') return '2-digit multiplier';
  }
  if (mode === 'division') {
    if (type === 'facts') return 'Facts';
    if (type === 'divide') return 'Divide';
    if (type === 'long_division') return 'Long division';
  }
  if (mode === 'place_value') {
    if (type === 'digit_value') return 'Digit value';
    if (type === 'standard') return 'Standard form';
    if (type === 'expanded') return 'Expanded form';
    if (type === 'word') return 'From words';
    if (type === 'compare') return 'Compare';
  }
  if (mode === 'rounding') {
    if (type === 'forward') return 'Round';
    if (type === 'reverse') return 'Which rounds?';
  }
  if (mode === 'factors') {
    if (type === 'pairs') return 'Factor pairs';
    if (type === 'multiples') return 'Multiples';
    if (type === 'list_multiples') return 'List multiples';
    if (type === 'prime_composite') return 'Prime or composite';
  }
  if (mode === 'times_as_many') {
    if (type === 'equation') return 'Equation';
    if (type === 'word') return 'Word problem';
    if (type === 'write_equation') return 'Write equation';
  }
  if (mode === 'money_count') {
    if (type === 'count') return 'Count coins & bills';
    if (type === 'make') return 'Make an amount';
  }
  if (mode === 'measurement') {
    if (type === 'length') return 'Length';
    if (type === 'volume') return 'Volume';
    if (type === 'weight') return 'Weight';
  }
  if (mode === 'time') {
    if (type === 'read') return 'Read the clock';
    if (type === 'elapsed') return 'Elapsed time';
    if (type === 'convert') return 'Convert units';
  }
  if (mode === 'fractions') {
    if (type === 'add') return 'Add';
    if (type === 'subtract') return 'Subtract';
    if (type === 'multiply') return 'Multiply';
    if (type === 'compare') return 'Compare';
  }
  if (mode === 'input_output') {
    if (type === 'fill') return 'Fill missing';
    if (type === 'find_rule') return 'Find the rule';
  }
  return String(type).replace(/_/g, ' ');
}

export function answerHints(
  mode: string,
  type?: string | null,
): { label: string; placeholder: string; inputMode: string } | null {
  if (mode === 'factors') {
    if (type === 'pairs') {
      return { label: 'Factor pairs', placeholder: 'e.g. 1x12, 2x6, 3x4', inputMode: 'text' };
    }
    if (type === 'multiples') {
      return { label: 'Yes or no', placeholder: 'yes or no', inputMode: 'text' };
    }
    if (type === 'list_multiples') {
      return { label: 'Multiples', placeholder: 'e.g. 2, 4, 6, 8, 10', inputMode: 'text' };
    }
    if (type === 'prime_composite') {
      return {
        label: 'Prime, composite, or neither',
        placeholder: 'prime, composite, or neither',
        inputMode: 'text',
      };
    }
  }
  if (mode === 'rounding') {
    if (type === 'reverse') {
      return {
        label: 'A number that rounds',
        placeholder: 'Any number that rounds to the target',
        inputMode: 'numeric',
      };
    }
    return { label: 'Rounded number', placeholder: 'Rounded number', inputMode: 'numeric' };
  }
  if (mode === 'times_as_many') {
    if (type === 'write_equation') {
      return { label: 'Equation', placeholder: 'e.g. 24 = 3 × 8', inputMode: 'text' };
    }
    return { label: 'Your answer', placeholder: 'Type the number', inputMode: 'numeric' };
  }
  if (mode === 'place_value') {
    if (type === 'expanded') {
      return { label: 'Expanded form', placeholder: 'e.g. 3000 + 200 + 5', inputMode: 'text' };
    }
    if (type === 'compare') {
      return { label: 'Compare', placeholder: '<, >, or =', inputMode: 'text' };
    }
    return { label: 'Your answer', placeholder: 'Type the number', inputMode: 'numeric' };
  }
  if (mode === 'money_count') {
    if (type === 'make') {
      return { label: 'Number of coins', placeholder: 'Fewest coins total', inputMode: 'numeric' };
    }
    return { label: 'Amount', placeholder: 'e.g. $1.35 or 135¢', inputMode: 'decimal' };
  }
  if (mode === 'money_change') {
    return { label: 'Change', placeholder: 'e.g. $0.25 or 25¢', inputMode: 'decimal' };
  }
  if (mode === 'money_compare') {
    return { label: 'Compare', placeholder: '<, >, or =', inputMode: 'text' };
  }
  if (mode === 'measurement') {
    return { label: 'Converted amount', placeholder: 'Type the number', inputMode: 'numeric' };
  }
  if (mode === 'time') {
    if (type === 'convert') {
      return { label: 'Your answer', placeholder: 'Minutes, or h:mm', inputMode: 'text' };
    }
    return { label: 'Time', placeholder: 'e.g. 3:30', inputMode: 'text' };
  }
  if (mode === 'fractions') {
    if (type === 'compare') {
      return { label: 'Compare', placeholder: '<, >, or =', inputMode: 'text' };
    }
    return { label: 'Fraction', placeholder: 'e.g. 3/4 or 1 1/2', inputMode: 'text' };
  }
  if (mode === 'order_of_operations') {
    return { label: 'Value', placeholder: 'Type the result', inputMode: 'numeric' };
  }
  if (mode === 'input_output') {
    if (type === 'find_rule') {
      return { label: 'Rule', placeholder: 'e.g. + 5 or × 3', inputMode: 'text' };
    }
    return { label: 'Missing values', placeholder: 'e.g. 12, 8', inputMode: 'text' };
  }
  if (mode === 'geography') {
    return { label: 'Your answer', placeholder: 'Place name or abbreviation', inputMode: 'text' };
  }
  if (mode === 'pattern') {
    return { label: 'Next item', placeholder: 'What comes next?', inputMode: 'text' };
  }
  if (mode === 'riddle' || mode === 'fill_blank' || mode === 'science_quiz') {
    return { label: 'Your answer', placeholder: 'Type your answer', inputMode: 'text' };
  }
  return null;
}

export function difficultyLabel(id?: string | null): string {
  if (id === 'easy') return 'Easy';
  if (id === 'hard') return 'Hard';
  return 'Medium';
}
