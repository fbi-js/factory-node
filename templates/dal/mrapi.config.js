module.exports = {
  dal: {
    <%_ if (project.features['multi-tenant']) { _%>
    services: [
      {
        name: 'blog',
        db: {
          tenants: {
            tencent: '',
            alibaba: '',
          },
          defaultTenant: 'tencent',
        },
      },
      {
        name: 'music',
        db: {
          tenants: {
            tencent: '',
            alibaba: '',
          },
          defaultTenant: 'tencent',
        },
        openapi: {
          enable: false,
        },
      },
    ],
    // enabled services management
    management: {},
    <%_ } else { _%>
    services: [
      {
        db: 'mysql://root:123456@0.0.0.0:3306/blog',
      },
    ],
    <%_ } _%>
  },
}
