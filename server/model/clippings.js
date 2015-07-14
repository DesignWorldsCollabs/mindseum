module.exports = {
  type: 'object',
  additionalProperties: true,
  properties: {
    title: {type: 'string'},
    summary: {type: 'string'},
    url: {type: 'string'},
    userId: {type: 'string'}
  },
  required: ['url', 'userId']
}

