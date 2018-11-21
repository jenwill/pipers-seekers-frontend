import React from 'react';
import { configure as configureEnzyme, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';


// import { render as renderDom } from 'react-dom';

import Landing from '../components/landing/landing';

configureEnzyme({ adapter: new Adapter() });

describe('Landing component', () => {
  const mockStore = configureStore();
  const initialState = {
    username: '',
    socket: null,
    joinRoom: true,
    roomCode: '',
    authFormDisplay: true,
  };
  test('', () => {
    const mountedLanding = mount(<Provider store={mockStore(initialState)}><Landing /></Provider>);

    // console.log(mountedLanding.html());
    expect(mountedLanding.find('button').length).toEqual(2);
  });
});
