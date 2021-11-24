import { TopNav } from './TopNav';
import { PopularRecipes } from '../recipe/PopularRecipes';
import { RecentRecipes } from '../recipe/RecentRecipes';
import { Setting } from './Setting';

export const Sidebar = () => {
  return (
    <div className='flex flex-col items-center justify-start bg-24 h-full font-Raleway'>
      <div>
        <TopNav />
      </div>

      <div className='flex flex-col overflow-hidden mt-4'>
        <PopularRecipes />
        <RecentRecipes />
      </div>

      <div className='flex flex-col items-center justify-center mt-auto w-full'>
        <Setting />
      </div>
    </div>
  );
};
