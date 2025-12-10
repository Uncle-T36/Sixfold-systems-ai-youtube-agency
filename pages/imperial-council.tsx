/**
 * 👑 IMPERIAL COUNCIL PAGE
 * Ancient philosophical AI strategy system
 */

import ImperialCouncilDashboard from '../components/ImperialCouncilDashboard';
import PageLayout from '../components/PageLayout';

export default function ImperialCouncilPage() {
  return (
    <PageLayout title="Imperial Council" showBack={false}>
      <ImperialCouncilDashboard />
    </PageLayout>
  );
}
