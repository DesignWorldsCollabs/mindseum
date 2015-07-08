module.exports = {
  properties: {
    width: {
      type: 'integer',
      minimum: 1
    },
    height: {
      type: 'integer',
      minimum: 1
    },
    beads: {
      type: 'array',
      items: {
        type: 'object'
      } // [{id: string, x: float, y: float}]
    }
  },
  required: ['width', 'height', 'beads']
}

