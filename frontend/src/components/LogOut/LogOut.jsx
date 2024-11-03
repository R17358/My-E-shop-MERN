import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {logout} from '../../actions/userAction'
import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';

function LogOut() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(logout());
    }, [dispatch]); // This ensures `logout` is only called once on component mount

  return (
    <Icon />
  )
}

export default LogOut

