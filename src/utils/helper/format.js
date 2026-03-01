const formatDate = (data) => {
    return new Date(data).toLocaleDateString() ;
};

export { formatDate };