import { useEffect, useState } from "react";

interface IError {
  isError: boolean;
  errorMessage: string;
}

export default function useFetch(
  url: string,
  environmentOption: string,
  poll: boolean,
  interval: number
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

  useEffect(() => {
    setIsLoading(true);
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Environment: environmentOption,
      },
    };
    fetchData(url, options);
    if(poll){
      const intervalId = setInterval(() => {
        setError({
          isError: false,
          errorMessage: "",
        })
        fetchData(url, options);
      }, interval);
      
      return () => clearInterval(intervalId);
    }
  }, [url, environmentOption, poll]);

  const fetchData = async (url: string, options?: RequestInit) => {
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
