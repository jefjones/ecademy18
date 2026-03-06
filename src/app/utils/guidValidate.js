export const isGuidNotEmpty = (varText) => {
	return !varText || varText === '00000000-0000-0000-0000-000000000000' ? false : true;
}

export const emptyGuid = () => {
	return '00000000-0000-0000-0000-000000000000';
}

export const guidEmpty = '00000000-0000-0000-0000-000000000000';
