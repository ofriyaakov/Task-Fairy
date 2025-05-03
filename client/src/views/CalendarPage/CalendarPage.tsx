import { useState } from 'react';
import SuggestionsDialog from './../../components/SuggestionsModal'

const CalendarPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true)

  //CHANGE AFTER CONNECTING THE CALEMDER AND THE MODAL
  return <SuggestionsDialog open={isModalOpen} setIsModalOpen={setIsModalOpen} />;
};

export default CalendarPage;