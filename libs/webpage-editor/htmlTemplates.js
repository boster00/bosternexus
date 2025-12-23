/**
 * HTML Templates for Webpage Editor
 * Based on Bootstrap 4.4.1 and Boster website patterns
 * These templates produce plain HTML compatible with the existing website
 */

export const htmlTemplates = {
  /**
   * Placeholder Hero Section
   * Compatible with Bootstrap 4.4.1 and Boster styles
   */
  heroPlaceholder: `
    <section class="hero-section py-5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 400px; display: flex; align-items: center;">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center text-white">
            <h1 class="display-4 font-weight-bold mb-4">Welcome to Your New Page</h1>
            <p class="lead mb-4">This is a placeholder hero section. Click to edit and customize your content.</p>
            <a href="#" class="btn btn-light btn-lg px-5">Get Started</a>
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * Content Section with Text
   */
  contentSection: `
    <section class="content-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="mb-4">Content Section</h2>
            <p class="lead">Add your content here. This section can be customized with your own text, images, and formatting.</p>
            <p>You can add multiple paragraphs, lists, and other HTML elements to create rich content sections.</p>
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * Two Column Content Section
   */
  twoColumnSection: `
    <section class="content-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h3 class="mb-3">Left Column</h3>
            <p>Add content for the left column here.</p>
          </div>
          <div class="col-md-6">
            <h3 class="mb-3">Right Column</h3>
            <p>Add content for the right column here.</p>
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * Features Section (3 columns)
   */
  featuresSection: `
    <section class="features-section py-5 bg-light">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <div class="feature-item">
              <h4>Feature 1</h4>
              <p>Description of feature 1</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="feature-item">
              <h4>Feature 2</h4>
              <p>Description of feature 2</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="feature-item">
              <h4>Feature 3</h4>
              <p>Description of feature 3</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * Call to Action Section
   */
  ctaSection: `
    <section class="cta-section py-5" style="background-color: #f8f9fa;">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="mb-4">Ready to Get Started?</h2>
            <p class="lead mb-4">Join us today and experience the difference.</p>
            <a href="#" class="btn btn-primary btn-lg px-5">Sign Up Now</a>
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * Form Section
   */
  formSection: `
    <section class="form-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mx-auto">
            <h2 class="mb-4">Contact Us</h2>
            <form>
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" id="name" placeholder="Your name">
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" placeholder="your.email@example.com">
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea class="form-control" id="message" rows="5" placeholder="Your message"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
};

/**
 * Get full page HTML with head assets
 * Loads CSS and JS directly from bosterbio.com/design-guide/new.html
 * All assets are scoped to the iframe only
 */
export function getFullPageHTML(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boster Page</title>
  
  <!-- Fonts and icons -->
  <link href="https://fonts.googleapis.com/css?family=Josefin+Sans:400,700|Muli:400,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css">
  
  <!-- Bootstrap 4.4.1 CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  
  <!-- Boster CSS Files (loaded from bosterbio.com) -->
  <link rel="stylesheet" href="https://www.bosterbio.com/css/styles-m.css">
  <link rel="stylesheet" href="https://www.bosterbio.com/css/styles-l.css">
  <link rel="stylesheet" href="https://www.bosterbio.com/css/custom.css?v=12">
  
  <!-- Base URL for relative assets -->
  <base href="https://www.bosterbio.com/">
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

/**
 * Get section library for Add Section modal
 */
export function getSectionLibrary() {
  return [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Large banner section with headline and CTA',
      template: htmlTemplates.heroPlaceholder,
    },
    {
      id: 'content',
      name: 'Content Section',
      description: 'Single column content section',
      template: htmlTemplates.contentSection,
    },
    {
      id: 'two-column',
      name: 'Two Column Section',
      description: 'Two column layout for side-by-side content',
      template: htmlTemplates.twoColumnSection,
    },
    {
      id: 'features',
      name: 'Features Section',
      description: 'Three column features grid',
      template: htmlTemplates.featuresSection,
    },
    {
      id: 'cta',
      name: 'Call to Action',
      description: 'Centered CTA section with button',
      template: htmlTemplates.ctaSection,
    },
    {
      id: 'form',
      name: 'Contact Form',
      description: 'Contact form section',
      template: htmlTemplates.formSection,
    },
  ];
}
