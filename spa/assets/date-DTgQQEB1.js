function i(t){const r=typeof t=="string"?new Date(t):t;if(isNaN(r.getTime()))throw new Error("Invalid date input");return r.toISOString()}export{i as t};
