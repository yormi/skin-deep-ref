[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# skin-deep-ref

Thin skin-deep wrapper with the possibility to get a component by ref.

This is a wrapper instead of a fork to make it easy to integrate the future potential change in
skin-deep.

I was using it for a few project so I thought I'll share if someone has the same need.

## API

See [skin-deep](https://github.com/glenjamin/skin-deep/) docs with the following humble addition:

### `tree.ref(ref)`
`ref`: The ref given to the react element. Only gets the elements that would be contained in the
`rootOfTheTree.refs`.

returns the subtree with the requested component as root.

#### Relevant tests
```
✓ returns the subtree of the requested ref at immediate level
✓ returns the subtree of the requested ref even at DOM-nested-level
✓ returns false if no element is found with the requested ref
✓ returns false if a ref owned by a child React component is requested
✓ throws an error if it find more than one ref
```

## Credit

All the credit goes to [glenjamin](https://github.com/glenjamin) I just shamelessly made it fits my needs :P
