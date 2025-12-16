export function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
        throw new Error('Input must be a non-empty string');
    }

    const words = str.split(' ');

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    
    return words.join(' ');
}

export function reverse(str) {
    if (typeof str !== 'string' || str.length === 0)
	{
		throw new Error('reverse requires a non-empty string argument')	}

	return str.split('').reverse().join('');
}

export default function toSnakeCase(str) {
    if (typeof str !== 'string' || str.length === 0) {
        throw new Error('Input must be a non-empty string');
    }
    
    return str.replace(/\s+/g, '_').toLowerCase();
}