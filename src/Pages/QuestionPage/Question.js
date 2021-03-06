import { Button, Empty, Input, Row } from "antd";
import React, { useState } from "react";
import { useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { Pagination } from "../../components/Pagination";
import { RootContext } from "../../ContextProviders";
import { DataTable } from "./DataTable";
import { CSVLink } from 'react-csv'
const { Search } = Input;

const Question = () => {
  // const dispatch = useDispatch()
  const [searchValue, setsearchValue] = useState("");
  const [currentPage, setcurrentPage] = useState([1]);
  const [dataPerPage] = useState([5]);
  const end = currentPage * dataPerPage;
  const begin = end - dataPerPage;
  const paginate = (pageNumber) => setcurrentPage(pageNumber);
  //  const [data,setData]=useState([])
  //  const data = useSelector(state => state.question.questions)
  //  console.log(data)
  
  const { dataQuestions, importQuestion } = useContext(RootContext);
  const filterDataSearch = dataQuestions.filter((filterData) => {
    return filterData.language.toLowerCase().includes(searchValue.toLowerCase())
  });
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      // dispatch(importQuestion(d))
      importQuestion(d);
    });
  };
  return (
    <div>
      <div
        className="content-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
      >
        {dataQuestions.length !== 0 ? (
          <Row>
            <strong style={{ marginRight: 20 }}>ADD QUESTIONS </strong>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
              }}
            />
          </Row>
        ) :   <strong style={{ marginRight: 20 }}>ADD QUESTIONS </strong>}
        <Row>
        <Search
          placeholder="Search sản phẩm..."
          onSearch={(value) => console.log(value)}
          style={{ width: 300 }}
        />
        <Button style={{marginLeft:20}} type="primary">
        <CSVLink data={dataQuestions} filename={'questions-'+ new Date()+'.csv'}>Export</CSVLink>
        </Button>
        </Row>
       
      </div>
      {dataQuestions.length === 0 ? (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 150,
          }}
          description={<span>Import from Excel</span>}
        >
          {" "}
          <Row
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
              }}
            />
          </Row>
        </Empty>
      ) : (
        searchValue!==''? 
        <>
          <DataTable data={filterDataSearch.slice(begin, end)} />
          <Pagination
            dataPerPage={dataPerPage}
            totalData={filterDataSearch.length}
            paginate={paginate}
          />
        </>:
        <>
        <DataTable data={dataQuestions.slice(begin, end)} />
        <Pagination
          dataPerPage={dataPerPage}
          totalData={dataQuestions.length}
          paginate={paginate}
        />
      </>

      )}
    </div>
  );
};
export default Question;
