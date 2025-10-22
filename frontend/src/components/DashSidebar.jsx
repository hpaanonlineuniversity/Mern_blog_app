import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";

import {
    HiArrowSmRight,
    HiChartPie,
    HiUser,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
} from 'react-icons/hi';

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { signOut } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');


    const handleSignOut = async () => {
        try {
                await fetch(`/api/user/signout`);
                dispatch(signOut());
                } catch (error) {
                console.log(error);
                }
         };

  return (
    <Sidebar className='w-full md:w-56'>
      <SidebarItems>
        <SidebarItemGroup className='flex flex-col gap-1'>

          <Link to='/dashboard?tab=profile'>
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </SidebarItem>
          </Link>

          <SidebarItem
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignOut}
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
};