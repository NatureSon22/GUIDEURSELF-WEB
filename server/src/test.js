const getContentURL = async (filename) => {
    try {
      const alldocuments = await fetch(CODY_URLS.LIST_DOCUMENT(), {
        method: "GET",
        headers: HEADERS,
      });
  
      const { data } = await alldocuments.json();
  
      const doc = data.find((doc) => doc.name === filename);
  
      return doc ? { content_url: doc.content_url, id: doc.id } : {};
    } catch (error) {
      throw new Error(error);
    }
  };