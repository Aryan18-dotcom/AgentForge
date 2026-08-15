import BackgroundContainer from '../common/BackgroundConatiner';
import Navbar from './Navbar';

interface DashboardContainerProps {
    children?: React.ReactNode;
}

export default function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <BackgroundContainer>
      <div className="h-full w-full px-2 font-body pb-12 relative">
        <Navbar />

        {children}
      </div>
    </BackgroundContainer>
  );
}