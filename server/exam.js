"use strict";

/**
 * Constructor function for new Exam objects
 * @param {string} code 
 * @param {string} name
 * @param {number} credits
 * @param {string} max 
 * @param {number} preparation 
 * @param {Array} incompatible 
 */
function Exam(code, name, credits, max, preparation, incompatible) {
  this.code = code;
  this.name = name;
  this.credits = credits;
  this.max = max;
  this.preparation = preparation;
  this.incompatible = incompatible;
}

exports.Exam = Exam;
exports.modules = {Exam};