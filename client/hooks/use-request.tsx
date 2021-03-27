import axios from "axios";
import { useState } from "react";

export interface Request {
  url: string;
  method: "post" | "get";
  body?: object;
  onSuccess(data?: any): void;
}

const useRequest = ({ url, method, body, onSuccess }: Request) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
      onSuccess(response.data);
    } catch (e) {
      setErrors(
        <div className="my-3 bg-red-400">
          <ul className="p-3">
            {e.response.data.errors.map((e) => (
              <li key={e.message} className="text-red-100 my-2">
                {e.message}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
