// import jsdom from 'jsdom-global'
// jsdom()
//
// global.window = window
// global.document = document
//
// import test from 'blue-tape'
// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
// import { createContainer, resource } from '../source/index'
// import sinon from 'sinon'
// import { shallow } from 'enzyme'
// // import TestUtils from 'react-addons-test-utils'
// // import { getMountedInstance } from 'react-shallow-testutils'
//
// import MockAgent from './mockAgent'
// class MockWrappedComponent extends Component {
//   render() {
//     console.log('reeeender')
//     return <div />
//   }
// }
//
// const getProps = function() {
//   return this.props
// }
//
// const DefaultContainer = createContainer(
//   MockWrappedComponent,
//   (props, data) => ({
//     test: {
//       base: `test_url`,
//       list: '/list',
//       create: `/create`,
//       read: `/read/${props.id}`,
//       patch: `/patch/${props.id}`,
//       put: `/put/${props.id}`,
//       del: `/patch/${props.id}`,
//     },
//   }),
//   MockAgent
// )
//
// const ItemContainer = createContainer(
//   MockWrappedComponent,
//   (props, data) => ({
//     test: {
//       base: `test_url`,
//       list: `/list`,
//       item: `/item/${props.id}`,
//     },
//   }),
//   MockAgent
// )
//
// const CustomContainer = createContainer(
//   MockWrappedComponent,
//   (props, data) => ({
//     test: {
//       base: `test_url`,
//       defaultOperation: 'read',
//       uid: 'custom_id',
//       list: {uri: `/custom_list/${props.list_id}`, method: 'POST'},
//       create: {uri: '/create', method: 'POST'},
//       read: {uri: `/custom_read/${data.read_id}`, method: 'POST'},
//       patch: {uri: '/custom_patch', method: 'POST'},
//       put: {uri: `/custom_put/${props.put_id}`, method: 'POST'},
//       del: {uri: '/custom_del', method: 'POST'},
//     },
//   }),
//   MockAgent
// )
//
// test('fetches data: default config', (t) => {
//   t.plan(2)
//   console.log(DefaultContainer)
//   const spy = sinon.spy(
//     DefaultContainer.compose.methods,
//     "componentWillReceiveProps"
//   );
//   const wrapper = shallow(
//     <DefaultContainer
//       getProps={getProps}
//       id={5}
//     />
//   );
//
//   t.equal(spy.calledOnce, false);
//   // wrapper.setProps({ prop: 2 });
//   // expect(spy.calledOnce).to.equal(true);
//   setTimeout(() => {
//     t.equal(spy.calledOnce, true);
//     // console.log(component)
//     t.end()
//
//   }, 2000)
//   // let node = document.createElement('div');
//   // let component = React.render(
//   //   <DefaultContainer
//   //     getProps={getProps}
//   //     id={5}
//   //   />,
//   //   node
//   // );
//   // TestUtils.renderIntoDocument(
//   //   <DefaultContainer
//   //     getProps={getProps}
//   //     id={5}
//   //   />
//   // )
// })
//
// test('fetches data: item config', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('fetches data: custom config', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: default config: create', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: default config: update', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: default config: remove', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: item config: create', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: item config: update', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: item config: remove', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: custom config: create', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: custom config: update', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutates data: custom config: remove', (t) => {
//   t.plan(0)
//   t.end()
// })
//
// test('mutate callback works', t => {
//   t.plan(0)
//   t.end()
// })
//
// test('resource() creates correct config', t => {
//   t.plan(0)
//   t.end()
// })
//
// test('custom agent', t => {
//   t.plan(0)
//   t.end()
// })
//
// // test('Greet World', (assert) => new Promise((resolve) => {
// //   assert.equal(hello('World'), 'Hello, World!');
// //
// //   setTimeout(() => {
// //     // do some async stuff
// //     resolve();
// //   }, 10);
// // }));
// //
// //
// // test('Should support object spread', (assert) => new Promise((resolve) => {
// //   const options = {x: 1, y: 2, z: 3};
// //   const {x, ...opts} = options;
// //
// //   assert.equal(x, 1);
// //   assert.deepEqual(opts, {y: 2, z: 3});
// //
// //   resolve();
// // }));
