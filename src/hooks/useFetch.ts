import { useEffect, useRef, useState } from "react";

interface IError {
  isError: boolean;
  errorMessage: string;
}

export default function useFetch(
  url: string,
  options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
) {
  /**
   * A custom hook for fetching data from an API.
   *
   * @param {string} url - The URL to fetch data from.
   * @returns {object} An object containing the fetched data.
   */

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IError>({
    isError: false,
    errorMessage: "",
  });
  const apiFired = useRef(false);

  useEffect(() => {
    if (url && !apiFired.current) {
      apiFired.current = true;
      fetchData(url, options);
    }
  }, [url]);

  const fetchData = async (url: string, options?: RequestInit) => {
    setIsLoading(true);
    try {
      fetch(url, options)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            setError({
              isError: true,
              errorMessage: response.statusText,
            });
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch(() => {
          setError({
            isError: true,
            errorMessage: "Something went wrong",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setError({
        isError: true,
        errorMessage: "Something went wrong",
      });
    }
  };

  return {
    data,
    isLoading,
    isError: error.isError,
    errorMessage: error.errorMessage,
  };
}
