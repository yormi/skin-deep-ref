'use strict'

/* global describe, it */

import assert from 'assert'

import React from 'react'

import sd from './skin_deep_wrapper'

describe('Skin Deep Wrapper', () => {
  describe('Refs', () => {
    const aReactComponentChildRef = 'childrenRef'
    const aDOMElementChildRef = 'childrenRef2'
    const aRootRef = 'rootRef'
    const anUnexistingRef = 'aSillyRef'
    const aDoubleRef = 'imUsedTwiceForTheSameComponent'
    const rootElementRef = 'rootElementRef'
    const aRefOwnedByChild = 'aRefOwnedByChild'

    const ComponentWithChildrenRefs = React.createClass({
      render: () => {
        return <h1 ref={aReactComponentChildRef}>Allo</h1>
      }
    })

    const RootComponent = React.createClass({
      render: () => {
        return (
          <div ref={rootElementRef}>
            <ComponentWithChildrenRefs><h2 ref={aRefOwnedByChild} /></ComponentWithChildrenRefs>

            <h1 ref={aDoubleRef} />
            <h2 ref={aDoubleRef} />

            <div ref={aRootRef}>
              <h3 ref={aDOMElementChildRef} />
            </div>

          </div>
        )
      }
    })

    const tree = sd.shallowRender(<RootComponent />)

    it('returns the subtree of the requested ref at immediate level', () => {
      const result = tree.ref(aRootRef)
      assert.strictEqual(result.ref, aRootRef)
    })

    it('returns the subtree of the requested ref even at DOM-nested-level', () => {
      const result = tree.ref(aDOMElementChildRef)
      assert.strictEqual(result.ref, aDOMElementChildRef)
    })

    it('returns false if no element is found with the requested ref', () => {
      const result = tree.ref(anUnexistingRef)
      assert(!result, 'Should return false')
    })

    it('returns false if a ref owned by a child React component is requested', () => {
      const result = tree.ref(aRefOwnedByChild)
      assert(!result, 'Should return false')
    })

    it('throws an error if it find more than one ref', () => {
      assert.throws(() => tree.ref(aDoubleRef), Error, 'An error should have been thrown')
    })
  })

  describe('WrappedSubTree', () => {
    it('wraps every subTree of a returned array', () => {
      class SomeComponent extends React.Component {
        render () {
          return (
            <ul>
              <li>foo</li>
              <li>bar</li>
            </ul>
          )
        }
      }

      const tree = sd.shallowRender(<SomeComponent />)
      const subTrees = tree.everySubTree('li')

      subTrees.map((sT) => assert.ok(sT.ref))
    })

    it('does not wrap subTree return value if subTree returns false', () => {
      class SomeComponent extends React.Component {
        render () {
          return <h1>Nothing really important</h1>
        }
      }

      const tree = sd.shallowRender(<SomeComponent />)
      const subTree = tree.subTree('should not be found')

      assert(!subTree, 'SubTree should be false')
    })
  })
})
