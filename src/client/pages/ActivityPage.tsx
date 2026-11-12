import { Navigate, useParams } from 'react-router-dom';
import { PracticeShell } from '@/components/practice/PracticeShell';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { findRouteMeta, PRACTICE_BY_ROUTE } from '@/lib/nav';

export function ActivityPage() {
  const params = useParams();
  const subject = params.subject || '';
  const activity = params.activity || '';
  const route = `${subject}/${activity}`;
  const info = findRouteMeta(route);

  if (!info.activity) {
    return <Navigate to="/home" replace />;
  }

  if (!info.activity.ready) {
    return <ComingSoonPage subject={info.crumb.split(' / ')[0]} activity={info.activity.label} />;
  }

  const config = PRACTICE_BY_ROUTE[route];
  if (!config) {
    return <Navigate to="/home" replace />;
  }

  return <PracticeShell key={route} config={config} />;
}
