"use client";

import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Badge from "../ui/badge/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurger,
  faMugHot,
  faList,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import config from "@/config";
import TableFoods from "./tableFoods";
import Swal from "sweetalert2";
import TotalPrice from "./totalPrice";

export interface Foods {
  id: number;
  name: string;
  price: number;
  img?: string;
  foodCategory: string;
}

export default function TableDinner() {
  const [tableDinner, setTableDinner] = useState<number>(1);
  const [foods, setFoods] = useState<Foods[]>([]);

  useEffect(() => {
    fetchFoodsData();
  }, []);

  const fetchFoodsData = async () => {
    try {
      const res = await axios.get(`${config.apiServer}/api/foods/list`);
      if (res.data.results) {
        setFoods(res.data.results);
      }
    } catch (error: unknown) {
      Swal.fire({
        title: "Fetch Data from Foods API have error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const filterFoods = async (foodCategory: string) => {
    try {
      const url = foodCategory === 'all' ? `${config.apiServer}/api/foods/list`:`${config.apiServer}/api/foods/filter/${foodCategory}`

      const res = await axios.get(url);
      setFoods(res.data.results);
    } catch (error) {
      Swal.fire({
        title: "Fetch Data from Foods API have error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center space-x-3">
        <div className="flex flex-row items-center space-x-2">
          <Label>Table number :</Label>
          <Input
            type="number"
            id="table-dinner"
            name="table-dinner"
            placeholder="Number of table dinner"
            value={tableDinner}
            onChange={(e) => setTableDinner(Number(e.target.value))}
          />
        </div>

        <div className="space-x-2">
          <button onClick={() => filterFoods("food")}>
            <Badge
              variant="solid"
              color="primary"
              size="md"
              startIcon={<FontAwesomeIcon icon={faBurger} />}
            >
              Foods
            </Badge>
          </button>
          <button onClick={() => filterFoods("drink")}>
            <Badge
              variant="solid"
              color="success"
              size="md"
              startIcon={<FontAwesomeIcon icon={faMugHot} />}
            >
              Beverages
            </Badge>
          </button>
          <button onClick={() => filterFoods("all")}>
            <Badge
              variant="solid"
              color="info"
              size="md"
              startIcon={<FontAwesomeIcon icon={faList} />}
            >
              Both
            </Badge>
          </button>
          <button>
            <Badge
              variant="solid"
              color="error"
              size="md"
              startIcon={<FontAwesomeIcon icon={faTrashCan} />}
            >
              Clear
            </Badge>
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-row space-x-2">
        <TableFoods foods={foods} tableDinner={tableDinner} />
        <TotalPrice/>
      </div>
    </div>
  );
}
