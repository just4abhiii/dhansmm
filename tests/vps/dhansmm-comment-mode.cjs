function dhanUsesCustomComments(type,service){if(type!=="comments"&&type!=="custom_comments")return false;const name=String(service?.serviceName||service?.name||"").toLowerCase();if(/random|emoji/.test(name))return false;return /custom[\s_-]*comments?/.test(name)}
module.exports={dhanUsesCustomComments};
