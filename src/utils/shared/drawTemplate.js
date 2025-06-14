/**
 * DRAW TEMPLATE UTILITY - PORTAL BETINA
 * Utility functions for drawing templates and guides on canvas
 * 
 * @version 1.0.0
 * @created 2025-06-06
 */

/**
 * Draw a template outline on the canvas
 * @param {CanvasRenderingContext2D} context - Canvas context
 * @param {Object} template - Template object with drawing instructions
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export const drawTemplate = (context, template, canvas) => {
  if (!context || !template || !canvas) return;

  const { width, height } = canvas;
  const centerX = width / 2;
  const centerY = height / 2;

  // Save current context state
  context.save();

  // Set template drawing style
  context.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  context.lineWidth = 2;
  context.setLineDash([5, 5]); // Dashed line for template

  try {
    switch (template.type || template.name?.toLowerCase()) {
      case 'house':
      case 'casa':
        drawHouse(context, centerX, centerY, width * 0.3);
        break;
      
      case 'tree':
      case 'árvore':
        drawTree(context, centerX, centerY, width * 0.25);
        break;
      
      case 'sun':
      case 'sol':
        drawSun(context, centerX * 0.3, centerY * 0.3, width * 0.15);
        break;
      
      case 'flower':
      case 'flor':
        drawFlower(context, centerX, centerY, width * 0.2);
        break;
      
      case 'car':
      case 'carro':
        drawCar(context, centerX, centerY, width * 0.4);
        break;
      
      case 'cat':
      case 'gato':
        drawCat(context, centerX, centerY, width * 0.25);
        break;
      
      case 'circle':
      case 'círculo':
        drawCircle(context, centerX, centerY, width * 0.3);
        break;
      
      case 'square':
      case 'quadrado':
        drawSquare(context, centerX, centerY, width * 0.3);
        break;
      
      case 'star':
      case 'estrela':
        drawStar(context, centerX, centerY, width * 0.2);
        break;
      
      case 'heart':
      case 'coração':
        drawHeart(context, centerX, centerY, width * 0.2);
        break;
      
      default:
        // Default simple shape
        drawCircle(context, centerX, centerY, width * 0.2);
        break;
    }
  } catch (error) {
    console.warn('Error drawing template:', error);
  }

  // Restore context state
  context.restore();
};

/**
 * Draw a simple house template
 */
const drawHouse = (context, x, y, size) => {
  const houseWidth = size;
  const houseHeight = size * 0.8;
  const roofHeight = size * 0.4;

  // House base
  context.beginPath();
  context.rect(x - houseWidth/2, y - houseHeight/2, houseWidth, houseHeight);
  context.stroke();

  // Roof
  context.beginPath();
  context.moveTo(x - houseWidth/2, y - houseHeight/2);
  context.lineTo(x, y - houseHeight/2 - roofHeight);
  context.lineTo(x + houseWidth/2, y - houseHeight/2);
  context.stroke();

  // Door
  const doorWidth = houseWidth * 0.2;
  const doorHeight = houseHeight * 0.5;
  context.beginPath();
  context.rect(x - doorWidth/2, y + houseHeight/2 - doorHeight, doorWidth, doorHeight);
  context.stroke();

  // Window
  const windowSize = houseWidth * 0.15;
  context.beginPath();
  context.rect(x + houseWidth/4 - windowSize/2, y - windowSize/2, windowSize, windowSize);
  context.stroke();
};

/**
 * Draw a simple tree template
 */
const drawTree = (context, x, y, size) => {
  const trunkWidth = size * 0.2;
  const trunkHeight = size * 0.6;
  const crownRadius = size * 0.5;

  // Trunk
  context.beginPath();
  context.rect(x - trunkWidth/2, y, trunkWidth, trunkHeight);
  context.stroke();

  // Crown (circle)
  context.beginPath();
  context.arc(x, y - crownRadius/2, crownRadius, 0, 2 * Math.PI);
  context.stroke();
};

/**
 * Draw a simple sun template
 */
const drawSun = (context, x, y, size) => {
  const sunRadius = size * 0.5;
  const rayLength = size * 0.3;

  // Sun circle
  context.beginPath();
  context.arc(x, y, sunRadius, 0, 2 * Math.PI);
  context.stroke();

  // Sun rays
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const startX = x + Math.cos(angle) * sunRadius;
    const startY = y + Math.sin(angle) * sunRadius;
    const endX = x + Math.cos(angle) * (sunRadius + rayLength);
    const endY = y + Math.sin(angle) * (sunRadius + rayLength);

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  }
};

/**
 * Draw a simple flower template
 */
const drawFlower = (context, x, y, size) => {
  const petalRadius = size * 0.3;
  const centerRadius = size * 0.15;
  const stemHeight = size * 0.8;

  // Stem
  context.beginPath();
  context.moveTo(x, y + centerRadius);
  context.lineTo(x, y + stemHeight);
  context.stroke();

  // Petals (5 circles around center)
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    const petalX = x + Math.cos(angle) * petalRadius;
    const petalY = y + Math.sin(angle) * petalRadius;

    context.beginPath();
    context.arc(petalX, petalY, petalRadius * 0.6, 0, 2 * Math.PI);
    context.stroke();
  }

  // Center
  context.beginPath();
  context.arc(x, y, centerRadius, 0, 2 * Math.PI);
  context.stroke();
};

/**
 * Draw a simple car template
 */
const drawCar = (context, x, y, size) => {
  const carWidth = size;
  const carHeight = size * 0.5;
  const wheelRadius = size * 0.1;

  // Car body
  context.beginPath();
  context.rect(x - carWidth/2, y - carHeight/2, carWidth, carHeight);
  context.stroke();

  // Car roof
  const roofWidth = carWidth * 0.6;
  const roofHeight = carHeight * 0.6;
  context.beginPath();
  context.rect(x - roofWidth/2, y - carHeight/2 - roofHeight, roofWidth, roofHeight);
  context.stroke();

  // Wheels
  context.beginPath();
  context.arc(x - carWidth/3, y + carHeight/2, wheelRadius, 0, 2 * Math.PI);
  context.stroke();

  context.beginPath();
  context.arc(x + carWidth/3, y + carHeight/2, wheelRadius, 0, 2 * Math.PI);
  context.stroke();
};

/**
 * Draw a simple cat template
 */
const drawCat = (context, x, y, size) => {
  const headRadius = size * 0.4;
  const bodyWidth = size * 0.6;
  const bodyHeight = size * 0.8;

  // Body (oval)
  context.beginPath();
  context.ellipse(x, y + headRadius, bodyWidth/2, bodyHeight/2, 0, 0, 2 * Math.PI);
  context.stroke();

  // Head (circle)
  context.beginPath();
  context.arc(x, y - headRadius/2, headRadius, 0, 2 * Math.PI);
  context.stroke();

  // Ears (triangles)
  const earSize = headRadius * 0.4;
  context.beginPath();
  context.moveTo(x - headRadius/2, y - headRadius/2);
  context.lineTo(x - headRadius/2 - earSize/2, y - headRadius);
  context.lineTo(x - headRadius/2 + earSize/2, y - headRadius);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.moveTo(x + headRadius/2, y - headRadius/2);
  context.lineTo(x + headRadius/2 - earSize/2, y - headRadius);
  context.lineTo(x + headRadius/2 + earSize/2, y - headRadius);
  context.closePath();
  context.stroke();

  // Tail
  context.beginPath();
  context.arc(x + bodyWidth/2, y + bodyHeight/4, size * 0.3, 0, Math.PI);
  context.stroke();
};

/**
 * Draw a simple circle template
 */
const drawCircle = (context, x, y, size) => {
  context.beginPath();
  context.arc(x, y, size/2, 0, 2 * Math.PI);
  context.stroke();
};

/**
 * Draw a simple square template
 */
const drawSquare = (context, x, y, size) => {
  context.beginPath();
  context.rect(x - size/2, y - size/2, size, size);
  context.stroke();
};

/**
 * Draw a simple star template
 */
const drawStar = (context, x, y, size) => {
  const outerRadius = size;
  const innerRadius = size * 0.4;
  const points = 5;

  context.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const pointX = x + Math.cos(angle - Math.PI/2) * radius;
    const pointY = y + Math.sin(angle - Math.PI/2) * radius;

    if (i === 0) {
      context.moveTo(pointX, pointY);
    } else {
      context.lineTo(pointX, pointY);
    }
  }
  context.closePath();
  context.stroke();
};

/**
 * Draw a simple heart template
 */
const drawHeart = (context, x, y, size) => {
  const heartSize = size;
  
  context.beginPath();
  context.moveTo(x, y + heartSize/4);
  
  // Left curve
  context.bezierCurveTo(
    x - heartSize/2, y - heartSize/4,
    x - heartSize, y + heartSize/8,
    x, y + heartSize/2
  );
  
  // Right curve
  context.bezierCurveTo(
    x + heartSize, y + heartSize/8,
    x + heartSize/2, y - heartSize/4,
    x, y + heartSize/4
  );
  
  context.stroke();
};

export default drawTemplate;
