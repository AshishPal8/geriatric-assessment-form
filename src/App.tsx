import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { AssessmentForm } from './features/assessment/AssessmentForm';
import { theme } from './theme';

const fakeSave = () => new Promise<void>((resolve) => setTimeout(resolve, 800));

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AssessmentForm onSave={fakeSave} />
    </MantineProvider>
  );
}
