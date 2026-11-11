<script setup lang="ts">
// The questions of an interactive CLI, drawn the way the terminal shows them.
interface Step {
  question: string;
  /** A typed answer, for free-text questions. */
  answer?: string;
  options?: string[];
  /** The options picked by default. */
  selected?: string[];
  /** Several options can be picked: square marks instead of round ones. */
  multiple?: boolean;
  hint?: string;
}

withDefaults(defineProps<{ steps: Step[]; title?: string }>(), { title: 'create-vercube' });
</script>

<template>
  <HomeWindow :title="title" class="my-5">
    <ol class="wizard">
      <li v-for="step in steps" :key="step.question" class="step">
        <p class="question">
          {{ step.question }}
          <span v-if="step.hint" class="hint">{{ step.hint }}</span>
        </p>
        <p v-if="step.answer" class="answer">{{ step.answer }}</p>
        <ul v-if="step.options" class="options">
          <li v-for="option in step.options" :key="option" class="option" :class="{ on: step.selected?.includes(option) }">
            <i class="mark" :class="{ square: step.multiple }" aria-hidden="true" />
            <span v-if="step.selected?.includes(option)" class="sr-only">Selected:</span>
            {{ option }}
          </li>
        </ul>
      </li>
    </ol>
  </HomeWindow>
</template>

<style scoped>
.wizard {
  margin: 2px 0;
}

.step {
  position: relative;
  padding: 0 0 16px 22px;
}

.step:last-child {
  padding-bottom: 0;
}

/* The rail joining one question to the next. */
.step:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 14px;
  bottom: -7px;
  left: 3px;
  width: 1px;
  background: var(--h-line);
}

/* The diamond of each question. */
.step::after {
  content: '';
  position: absolute;
  top: 7px;
  left: 0;
  width: 7px;
  height: 7px;
  background: var(--h-accent);
  transform: rotate(45deg);
}

.question {
  color: var(--h-ink);
}

.hint {
  margin-left: 8px;
  font-size: 11px;
  color: var(--h-dim);
}

.answer {
  color: var(--h-accent);
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 18px;
  margin-top: 2px;
}

.option {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--h-dim);
}

.option.on {
  color: var(--h-ink);
}

.mark {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  border: 1px solid #52525b;
  border-radius: 50%;
}

.mark.square {
  border-radius: 0;
}

.on .mark {
  border-color: var(--h-accent);
  background: var(--h-accent);
}
</style>
