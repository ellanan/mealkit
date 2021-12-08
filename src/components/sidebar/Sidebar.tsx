import { TopNav } from './TopNav';
import { PopularRecipes } from '../recipe/PopularRecipes';
import { RecentRecipes } from '../recipe/RecentRecipes';
import { Setting } from './Setting';

export const Sidebar = () => {
  return (
    <div
      className='flex flex-col items-center justify-start h-full font-Raleway'
      style={{
        backgroundColor: '#fff1ea',
        backgroundImage: `linear-gradient(45deg, #fa9d6e33, transparent)`,
      }}
    >
      <div>
        <TopNav />
      </div>

      <div className='flex flex-col overflow-hidden mt-4 w-full'>
        <PopularRecipes />
        <RecentRecipes />
      </div>

      <div className='flex flex-col items-center justify-center mt-auto w-full'>
        <Setting />
      </div>
    </div>
  );
};
