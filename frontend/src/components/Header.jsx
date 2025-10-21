import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { signOut } from '../redux/user/userSlice';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const file = useLocation().pathname;

   const handleSignOut = async () => {
      try {
        await fetch(`/api/user/signout`);
        dispatch(signOut());
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      <Navbar className='border-b-2'>
        <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
        >
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Hpa-an's
          </span>
        Blog App
      </Link>

          {/* Search Bar */}
      <div className='flex-1 max-w-lg mx-4'>
        <form className='w-full'>
          <TextInput
            type='text'
            placeholder='Search articles...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline rounded-full'
            size="md"
          />
        </form>
      </div>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

       {/* Navigation Links - NavbarLink ကို တိုက်ရိုက်သုံးပါ */}
        <NavbarCollapse>
          <NavbarLink as={Link} to='/' active={file === "/"}>
            Home
          </NavbarLink>
          <NavbarLink as={Link} to='/about' active={file === "/about"}>
            About
          </NavbarLink>
          <NavbarLink as={Link} to='/projects'active={file === "/projects"}>
            Projects
          </NavbarLink>
        </NavbarCollapse>


        <div className='flex gap-2 md:order-2'>
            {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt='user' img={currentUser.profilePicture} rounded />
              }
            >
              <DropdownHeader>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {currentUser.email}
                </span>
              </DropdownHeader>

              <Link to={'/profile'}>
                <DropdownItem>Profile</DropdownItem>
              </Link>

              <Link to={'/dashboard?tab=profile'}>
                <DropdownItem>Dashboard</DropdownItem>
              </Link>

              <DropdownDivider />
              <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
            </Dropdown>

          ) : (
            <Link to='/sign-in'>
              <Button color='purple' outline>
                Sign In
              </Button>
            </Link>
            )}          
        </div>


        {/* NavbarToggle ထည့်ပါ (mobile menu အတွက်) */}
        <NavbarToggle />

      </Navbar>
    </>
  )
}

export default Header
