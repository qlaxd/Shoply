import React from 'react';
import { UserSearch } from '../../components/features/user';
import { useNavigate } from 'react-router-dom';

const UserSearchPage = () => {
  const navigate = useNavigate();
  
  const handleSelectUser = (user) => {
    if (user && user._id) {
      navigate(`/users/${user._id}`);
    }
  };

  return <UserSearch onSelectUser={handleSelectUser} />;
};

export default UserSearchPage; 