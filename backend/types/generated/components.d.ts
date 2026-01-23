import type { Schema, Struct } from '@strapi/strapi';

export interface ProjectProjectCredit extends Struct.ComponentSchema {
  collectionName: 'components_project_credits';
  info: {
    description: 'Credit entry for people involved in the project';
    displayName: 'Project Credit';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProjectProjectSection extends Struct.ComponentSchema {
  collectionName: 'components_project_sections';
  info: {
    description: 'A customizable section for project case study';
    displayName: 'Project Section';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    images: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'project.project-credit': ProjectProjectCredit;
      'project.project-section': ProjectProjectSection;
    }
  }
}
