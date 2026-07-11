import exampleSchema from './exampleSchema.json';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import { ViewerView } from '@/views/Viewer/Viewer';

export async function Viewer() {
  const validSchema = JSON.stringify(exampleSchema);
  const endpointList = await getEndpoints(validSchema);

  return <ViewerView endpointList={endpointList} />;
}
