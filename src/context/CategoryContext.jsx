import React, { createContext, useState, useEffect } from "react";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [error, setError] = useState(null);
  console.log(selectedCategoryId, "category id");
  //  fetch categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://api.coolieno1.in/v1.0/core/categories",
        );
        // if (!response.ok) {
        //   throw new Error("Network response was not ok");
        // }
        const result = await response.json();
        setCategoryData(result);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  // fetch sub categories

  useEffect(() => {
    if (selectedCategoryId) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/sub-categories/category/${selectedCategoryId}`,
          );
          // if (!response.ok) {
          //   throw new Error("Network response was not ok");
          // }
          const result = await response.json();
          setSubCategoryData(result);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchSubCategories();
    }
  }, [selectedCategoryId]);

  // checking subcategory id

  useEffect(() => {
    if (selectedSubCategoryId) {
      console.log(selectedSubCategoryId, "selected sub category id in main");
    }
  }, [selectedSubCategoryId]);

  // fetch service
  useEffect(() => {
    if (selectedCategoryId && selectedSubCategoryId) {
      const fetchService = async () => {
        try {
          const response = await fetch(
            `https://api.coolieno1.in/v1.0/core/services/filter/${selectedCategoryId}/${selectedSubCategoryId}`,
          );
          // if (!response.ok) {
          //   throw new Error("Failed to fetch services");
          // }
          const data = await response.json();
          setServicesData(data.data); // Assuming `data` contains the actual array
          console.log(data, "service data in main context");
        } catch (err) {
          setError(err.message);
          console.log(err);
        }
      };
      fetchService();
    }
  }, [selectedCategoryId, selectedSubCategoryId]);

  // Set first category ID as selectedCategoryId once categoryData is fetched
  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      setSelectedCategoryId(categoryData[0]._id);
    }
  }, [categoryData]);

  // Set first subcategory ID as selectedCategoryId once categoryData is fetched
  useEffect(() => {
    if (subCategoryData && subCategoryData.length > 0) {
      setSelectedSubCategoryId(subCategoryData[0]._id);
    }
  }, [subCategoryData]);

  return (
    <CategoryContext.Provider
      value={{
        categoryData,
        selectedCategoryId,
        setSelectedCategoryId,
        subCategoryData,
        selectedSubCategoryId,
        setSelectedSubCategoryId,
        servicesData,
        error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
