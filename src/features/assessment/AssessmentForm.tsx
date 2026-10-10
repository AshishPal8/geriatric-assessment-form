import dayjs from 'dayjs';
import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Code,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { schemaResolver, useForm } from '@mantine/form';
import { sampleAssessment } from './sampleAssessment';
import { Assessment, assessmentSchema, MOBILITY } from './schema';

type AssessmentFormValues = {
  [K in keyof Assessment]: Assessment[K] extends number
    ? number | string
    : Assessment[K] extends boolean
      ? boolean
      : Assessment[K] | null;
};

const initialValues: AssessmentFormValues = {
  mrn: '',
  patientName: '',
  dateOfBirth: null,
  assessmentDate: null,
  mobility: null,
  barthelIndex: '',
  medicationCount: '',
  pharmacistReviewRequested: false,
  followUpDate: null,
  consentObtained: false,
};

const toLabel = (value: string) => {
  const words = value.replaceAll('_', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const mobilityOptions = MOBILITY.map((value) => ({ value, label: toLabel(value) }));

interface AssessmentFormProps {
  onSave: (assessment: Assessment) => Promise<void>;
}

export function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [savedAssessment, setSavedAssessment] = useState<Assessment | null>(null);

  const form = useForm<AssessmentFormValues, Assessment>({
    initialValues,
    validate: schemaResolver(assessmentSchema),
    validateInputOnBlur: true,
    transformValues: (values) => assessmentSchema.parse(values),
  });

  const handleSubmit = async (assessment: Assessment) => {
    setSavedAssessment(null);
    await onSave(assessment);
    setSavedAssessment(assessment);
  };

  const loadSample = () => {
    form.setValues(sampleAssessment);
    form.clearErrors();
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="sm" p="lg">
        <Title order={2} mb="md">
          Geriatric Care Assessment
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Medical record number"
              placeholder="MRN-004821"
              {...form.getInputProps('mrn')}
            />
            <TextInput label="Patient name" {...form.getInputProps('patientName')} />
            <DateInput label="Date of birth" {...form.getInputProps('dateOfBirth')} />
            <DateInput
              label="Assessment date"
              maxDate={dayjs().format('YYYY-MM-DD')}
              {...form.getInputProps('assessmentDate')}
            />
            <Select label="Mobility" data={mobilityOptions} {...form.getInputProps('mobility')} />
            <NumberInput
              label="Barthel Index"
              step={5}
              min={0}
              max={100}
              clampBehavior="none"
              {...form.getInputProps('barthelIndex')}
            />
            <NumberInput
              label="Regular medications"
              min={0}
              max={30}
              clampBehavior="none"
              {...form.getInputProps('medicationCount')}
            />
            <Checkbox
              label="Pharmacist review requested"
              {...form.getInputProps('pharmacistReviewRequested', { type: 'checkbox' })}
            />
            <DateInput label="Next review date" {...form.getInputProps('followUpDate')} />
            <Checkbox
              label="Consent"
              description="Patient or representative has given consent"
              {...form.getInputProps('consentObtained', { type: 'checkbox' })}
            />

            <Group justify="space-between">
              <Button variant="default" onClick={loadSample}>
                Load sample patient
              </Button>
              <Button type="submit" loading={form.submitting}>
                Save assessment
              </Button>
            </Group>
          </Stack>
        </form>

        {savedAssessment && (
          <Alert color="green" title="Assessment saved" mt="lg">
            <Code block>{JSON.stringify(savedAssessment, null, 2)}</Code>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
