'use strict'

import React from 'react'
import sd from 'skin-deep'

module.exports = {
  ...sd,
  shallowRender: (component, context) => {
    const tree = sd.shallowRender(component, context)
    return wrapTree(tree)
  }
}

const wrapTree = (tree) => {
  return {
    ...tree,
    subTree: wrapFunction(tree.subTree),
    everySubTree: wrapFunction(tree.everySubTree),
    dive: wrapFunction(tree.subTree),
    ref: (ref) => getRef(tree, ref)
  }
}

const wrapFunction = (fn) => {
  return (...args) => {
    const tree = fn(...args)

    if (Array.isArray(tree)) {
      return tree.map((t) => wrapTree(t))
    } else if (tree) {
      return wrapTree(tree)
    } else {
      return false
    }
  }
}

const getRef = (node, ref) => {
  const found = getRefInTree(node, ref)

  if (found.length > 1) {
    throw new Error('There is more than one component own by the tree root with the same ref string')
  } else if (found.length === 0) {
    return false
  } else {
    return found[0]
  }
}

const getRefInTree = (node, ref) => {
  let found = []

  if (node) {
    if (Array.isArray(node)) {
      const foundAmongSibbling = findRefAmongArrayEntries(node, ref)
      found = found.concat(foundAmongSibbling)
    } else {
      if (node.ref === ref) {
        found = found.concat(node)
      }

      if (!isAReactComponent(node)) {
        const foundAmongChildren = findRefAmongChildren(node, ref)
        found = found.concat(foundAmongChildren)
      }
    }
  }

  return found
}

const findRefAmongArrayEntries = (array, ref) => {
  let found = []

  array.map(node => {
    const foundInTree = getRefInTree(node, ref)
    found = found.concat(foundInTree)
  })

  return found
}

const findRefAmongChildren = (node, ref) => {
  if (hasChildren(node)) {
    var children = childrenArray(node.props.children)
    return getRefInTree(children, ref)
  }
  return []
}

const hasChildren = (node) => {
  return node.props && node.props.children
}

const childrenArray = (children) => {
  var array = []
  React.Children.forEach(children, (child) => {
    array.push(child)
  })
  return array
}

const isAReactComponent = (node) => {
  return typeof node.type === 'function'
}
