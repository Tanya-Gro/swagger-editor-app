import { Editor } from '@components/Editor/Editor';
import { EditorViewerLayout } from '@components/EditorViewerLayout/EditorViewerLayout';
import { Viewer } from '@components/Viewer/Viewer';

export default function MainRoute() {
  return <EditorViewerLayout editor={<Editor />} viewer={<Viewer />} />;
}
