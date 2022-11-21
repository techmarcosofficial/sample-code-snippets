/* eslint-disable */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Moment from "moment";
import Header from "../../components/layout/HomeHeader/Header";
import SideBar from "../../components/layout/SideBar/SideBar";
import DropDown from "../../components/common/DropDown";
import DropDownMenu from "../../components/common/DropDownMenu";
import Historical from "../../components/common/filters/Historical";
import ExportReport from "../../components/common/filters/ExportReport";
import HomeWelcome from "../../components/common/HomeWelcome";
import EmptyData from "../../components/common/EmptyData";

// charts components
import LineChart from "../../components/charts/LineChart";
import DonutChart from "../../components/charts/DonutChart";

import { RootState } from "../../redux/store";
import { logoutAction } from "../../redux/actions/authActions";
import {
  CURRENCY,
  currentDate,
  dateFormat,
  locationOptions,
  operationOptions,
  revenueDropdownMenuOptions,
  complianceDropdownMenuOptions,
  insuranceDropdownMenuOptions,
  getStatsByModule,
  findUserStoresOperations,
  operationConverter
} from "../../utils";
import {
  AccordionProps,
  APIParamsProps,
  LocationsProps,
  LineGrphProps,
  LicenseProps,
  LicenseStatProps,
  PolicyProps,
  PoliciesStatProps
} from "./props";
const currentYear = currentDate().getFullYear();

const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className={`toggle-table-wrap ${isOpen ? "open" : ""}`}>
      <div
        className={`d-none align-items-center justify-content-between mb-2 cursor-pointer ${isOpen ? "open" : ""}`}
        onClick={() => setOpen(!isOpen)}
        >
        <h3 className="md-head">{title}</h3>
        <i 
          className={`fa-solid ${isOpen ? "fa-angle-down" : "fa-angle-up"}`}></i>
      </div>
      <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
        <div className="table-responsive theme-table">{children}</div>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token: string = useSelector((state: RootState) => state.auth.token);
  const [locations, setLocations] = React.useState([]);
  const [operations, setOperations] = React.useState<any[]>([]);
  const [operationsDropdown, setOperationsDropdown] = React.useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedOperations, setSelectedOperation] = React.useState("");
  const [initialData, setInitialData] = React.useState<any>(null);
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  
  const [renewals, setRenewals] = React.useState<LicenseProps[]>([]);
  const [licensesStats, setLicensesStats] = React.useState<LicenseStatProps>();
  const [policies, setPolicies] = React.useState<any[]>([]);
  const [policiesStats, setPoliciesStats] = React.useState<PoliciesStatProps>();
  const [graphData, setGraphData] = React.useState<LineGrphProps>({
    yAxisLabel: "",
    categories: [{
      category: [{
        label: "",
      }]
    }],
    results: [{
      seriesname: "",
      color: "",
      anchorBgColor: "",
      data: [{
        value: 0,
        dashed: ""
      }]
    }],
  });

  // method to fetch revenues.
  const getRevenues = async (options: APIParamsProps) => {
    let url: string = `${process.env.REACT_APP_API_URL}/revenues/find-by-params?location=${options.location}&type_of_operation=${options.operation}&year=${options.year}`;
    return await (await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })).json();
  }

  // method to fetch licenses.
  const getLicenses = async () => {
    let today = currentDate();
    today.setDate(today.getDate() + 1);
    return await (await fetch(`${process.env.REACT_APP_API_URL}/licenses/find-by-params?expiry_date_start=${dateFormat(today)}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })).json();
  }

  // method to fetch licenses.
  const getPolicies = async () => {
    let today = currentDate();
    today.setDate(today.getDate() + 1);
    return await (await fetch(`${process.env.REACT_APP_API_URL}/policies/find-by-params?expiry_start_date=${dateFormat(today)}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })).json();
  }

  useEffect(() => {
    document.title = "Resin | Home";

    const options: APIParamsProps = {
      location: '',
      operation: '',
      year: '',
    }
    setLoading(true);
    // Fetch API data
    Promise.all([getRevenues(options), getLicenses(), getPolicies()])
    .then((res) => {
      setLoading(false);
      const revenuesResult: any = responseHandler(res[0]);
      const licensesResult: any = responseHandler(res[1]);
      const policiesResult: any = responseHandler(res[2]);
      if (!revenuesResult || !licensesResult || !policiesResult) {
        return;
      }
      setInitialData(revenuesResult);

      // show dropdown locations.
      showLocations(revenuesResult.locations);
      const operations = findUserStoresOperations(revenuesResult.locations);
      const newOperations = operationConverter(operations, revenuesResult.revenues);
      // show dropdown operations.
      showOperations(newOperations);
      showData(revenuesResult.revenues, newOperations);
      showLicenses(licensesResult.results, newOperations);
      showPolicies(policiesResult.results, newOperations);
    });
  }, []);

  const responseHandler = (response: any) => {
    if (response && [401, 403].includes(response.statusCode)) {
      dispatch(logoutAction());
      localStorage.clear();
      return;
    }
    return response;
  }

  // method to show dropdown locations.
  const showLocations = (locations: LocationsProps[]) => {
    if (locations) {
      // unique locations
      locations = locations.reduce((groups: any[], item: any) => {
        if (!groups.find((group: any) => group.itw_location_id === item.itw_location_id)) {
          groups.push(item);
        }
        return groups;
      }, []);
      // Set user locations.
      setLocations(
        locationOptions(
          locations.reduce((arr: any[], e: any) => {
            if (!arr.find((item) => item._id === e._id)) {
              arr.push(e);
            }
            return arr;
      }, [])));
    }
  }

  // method to show dropdown operations.
  const showOperations = (operations: any[]) => {
    if (operations) {
      // Set user operations.
      setOperations(operations);
      setOperationsDropdown(operationOptions(operations));
    }
  }

  // method to show graph data.
  const showData = (revenues: any[], operations: any[]) => {
    // set graph data.
    const categories = [{
      category: revenues.map(
        (revenue: any) => ({ label: revenue._id.toString() })),
    }];
    const items = operations.map((operation: any) => {
      return {
        seriesname: operation.title,
        anchorBgColor: operation.color_code,
        color: '#979797',
        data: operation.revenues.map((revenue: any) => {
          if (revenue.revenues.length) {
            if (revenue.year >= currentYear) {
              return {
                value: revenue.revenues.reduce((e: number, t: any) => {
                  return e += t.revenue;
                }, 0),
                dashed: "1",
              }
            }
            return {
              value: revenue.revenues.reduce((e: number, t: any) => {
                return e += t.revenue;
              }, 0),
            }
          } else {
            return { value: 0 };
          }
        }),
      }
    });
    setGraphData({
      yAxisLabel: '',
      categories,
      results: items
    });
  }

  // method to show licenses.
  const showLicenses = (licenses: LicenseProps[], operations: any[]) => {
    if (licenses) {
      licenses = licenses.map((license) => {
        let isExpiryNearBy = !1;
        const today = currentDate();
        today.setMonth(today.getMonth() + 1);
        if (license.license_expiry_date && today > new Date(license.license_expiry_date)) {
          isExpiryNearBy = !0;
        }
        return {
          ...license,
          isExpiryNearBy,
        }
      });

      const {
        total,
        convertedTotal,
        convertedTotalExt,
        states,
        items
      } = getStatsByModule('license', licenses, operations);
      // set licenses stats
      setLicensesStats({
        total,
        convertedTotal,
        convertedTotalExt,
        states,
        items
      });
      // set licenses i.e. limit 1
      setRenewals(licenses.slice(0, 1));
    }
  }

  // method to show policies.
  const showPolicies = (policies: PolicyProps[], operations: any[]) => {
    policies = policies.map((policy) => {
      let isExpiryNearBy = !1;
      const today = currentDate();
      today.setMonth(today.getMonth() + 1);
      if (policy.expiry_date && today > new Date(policy.expiry_date)) {
        isExpiryNearBy = !0;
      }
      return {
        ...policy,
        isExpiryNearBy,
      }
    });

    const {
      total,
      convertedTotal,
      convertedTotalExt,
      states,
      items
    } = getStatsByModule('policy', policies, operations);
    // set licenses stats
    setPoliciesStats({
      total,
      convertedTotal,
      convertedTotalExt,
      states,
      items
    });
    // set policies i.e. limit 1
    setPolicies(policies.slice(0, 1));
  }

  // method trigger on location change.
  const onLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLocation(e.target.value);

    const options: APIParamsProps = {
      location: e.target.value,
      // operation: selectedOperations ? selectedOperations : "",
      operation: !selectedOperations ? selectedOperations : "",
      year: selectedYear ? selectedYear : ""
    }
    setLoading(true);
    getRevenues(options).then((res) => {
      setLoading(false);
      if (e.target.value === "") {
        // reset data
        setSelectedOperation("");
        showLocations(res.locations);
        
        if (selectedOperations) {
          const locations = res.locations.reduce((groups: any[], item: any) => {
            if (!groups.find((group: any) => group.itw_location_id === item.itw_location_id)) {
              groups.push(item);
            }
            return groups;
          }, []);
          const operations = findUserStoresOperations(locations);
          const newOperations = operationConverter(operations, res.revenues);
          // showOperations(initialData.operations);
          showData(res.revenues, newOperations);
        } else {
          const operations = findUserStoresOperations(res.locations);
          const newOperations = operationConverter(operations, res.revenues);
          showOperations(newOperations);
          showData(res.revenues, newOperations);
        }
        return;
      }

      if (e.target.value && selectedOperations) {
        setSelectedOperation('');
      }
      // showOperations(res.operations);
      const operations = findUserStoresOperations(res.locations);
      const newOperations = operationConverter(operations, res.revenues);
      // show dropdown operations.
      showOperations(newOperations);
      showData(res.revenues, newOperations);
    });
  };

  // method trigger on operation change.
  const onOperationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOperation(e.target.value);
    const options: APIParamsProps = {
      location: selectedLocation ? selectedLocation : "",
      operation: e.target.value,
      year: selectedYear ? selectedYear : ""
    }
    setLoading(true);
    getRevenues(options).then((res) => {
      setLoading(false);
      if (e.target.value === '') {
        // reset default data
        const operations = findUserStoresOperations(res.locations);
        let newOperations = operationConverter(operations, res.revenues);
        showOperations(newOperations);
        showData(res.revenues, newOperations);
        return;
      }

      const operations = findUserStoresOperations(res.locations);
      let newOperations = operationConverter(operations, res.revenues);
      newOperations = newOperations.filter((newOperation: any) => newOperation._id === e.target.value)
      setOperations(newOperations);
      showData(res.revenues, newOperations);
    });
  };
  const onDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const today = currentDate();
    const options: APIParamsProps = {
      location: "",
      operation: "",
      year: ""
    }
    if (e.target.value) {
      today.setFullYear(today.getFullYear() - parseInt(e.target.value));
      setSelectedYear(today.getFullYear().toString());
      options.year = today.getFullYear().toString();
    }
    setLoading(true);
    getRevenues(options).then((response) => {
      setLoading(false);
      if (!e.target.value) {
        setSelectedLocation('');
        setSelectedOperation('');
        showLocations(response.locations);
        
        if (selectedOperations) {
          showOperations(initialData.operations);
          showData(response.revenues, initialData.operations);
        } else {
          const operations = findUserStoresOperations(response.locations);
          const newOperations = operationConverter(operations, response.revenues);
          showOperations(newOperations);
          showData(response.revenues, newOperations);
        }
        return;
      }

      if (e.target.value && selectedLocation) {
        setSelectedLocation('');
      }
      if (e.target.value && selectedOperations) {
        setSelectedOperation('');
      }

      setInitialData(response);

      // show dropdown locations.
      showLocations(response.locations);
      const operations = findUserStoresOperations(response.locations);
      const newOperations = operationConverter(operations, response.revenues);
      // show dropdown operations.
      showOperations(newOperations);
      showData(response.revenues, newOperations);
    });
  }

  const onReportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!e.target.value) {
      return;
    }
    
    const today = currentDate();
    const options: APIParamsProps = {
      location: selectedLocation,
      operation: selectedOperations,
      year: ""
    }
    today.setFullYear(today.getFullYear() - parseInt(e.target.value));
    setSelectedYear(today.getFullYear().toString());
    options.year = today.getFullYear().toString();
    getRevenues(options).then((response) => {
      const locations = response.locations.reduce((arr: any[], e: any) => {
        if (!arr.find((item) => item._id === e._id)) {
          arr.push(e);
        }
        return arr;
      }, []);
      const rows = [
        [
          "Locations",
          "Building",
          "Operations",
        ],
        // [
        //   1,
        //   "building1",
        //   "Operation1"
        // ],
      ];
      locations.forEach((location: any) => {
        rows.push([location._id, location.building, location.children.map((child: any) => child.type_of_operation.title).join()]);
      });

      const csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${e.target.value}-years-revenues.csv`);
      document.body.appendChild(link); // Required for FF
      link.click();
    });
  }
  return (
    <>
      <main className="main-wrapper">
        <SideBar />
        <section className="admin-home">
          <div className="inner-container">
            <Header user={user} />
            <div className="main-data">
              <HomeWelcome user={user} />
              <ul className="admin-tabs mb-3">
                <li>
                  <Historical onChange={onDurationChange} />
                </li>
                <li>
                  <ExportReport onChange={onReportChange} />
                </li>
              </ul>

              <div className="admin-card big-chart-card">
                <div className="head">
                  <div className="left">
                    <div className="dropdown">
                      <Link
                        to="/"
                        title="Menu"
                        className="head-md dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        Revenue {/* <i className="fa-solid fa-angle-down icon"></i> */}
                      </Link>
                      <div className="dropdown-menu theme-drop">
                        <Link
                          to="/"
                          title="Revenue"
                          className="link"
                        >
                          Revenue
                        </Link>
                        <Link
                          to="/"
                          title="Revenue YTD"
                          className="link"
                        >
                          Revenue YTD
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="right ml-auto mr-3 hide-mob">
                    <div className="select-row">
                      <DropDown
                        name="locations"
                        selectedItem={selectedLocation}
                        options={locations}
                        onChangeEvent={onLocationChange}
                      />
                      <DropDown
                        name="operations"
                        selectedItem={selectedOperations}
                        options={operationsDropdown}
                        onChangeEvent={onOperationChange}
                      />
                    </div>
                  </div>
                  {/* <DropDownMenu items={revenueDropdownMenuOptions()} /> */}
                  {/*
                    <div className="dropdown ham-drop">
                      <a
                        href="/"
                        title="Menu"
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <i className="fa-solid fa-bars"></i>
                      </a>
                      <div className="dropdown-menu dropdown-menu-right theme-drop">
                        <a href="/" title="List Item 1" className="link">
                          List Item 1
                        </a>
                        <a href="/" title="List Item 1" className="link">
                          List Item 1
                        </a>
                      </div>
                    </div>
                  */}
                </div>

                <div className="body px-0">
                  <div className="row big-chart align-items-center flex-column-reverse">
                    <div className="col-xl-12 chart-outer">
                      <div className="chart">
                        {
                          loading ? (
                            <div className="theme-loader auto show">
                              <div className="loader-outer">
                                <div className="loader">Loading...</div>
                              </div>
                            </div>
                          ) : (
                            <LineChart
                              labelYAxis={graphData.yAxisLabel}
                              categories={graphData.categories}
                              data={graphData.results}
                            />
                          )
                        }
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="chart-data flex-row flex-wrap mb-3 px-md-4 px-3">
                        {
                          operations.length ? operations.map(
                            (operation) => (
                              <div
                              key={operation._id}
                              title={operation.title}
                              className={`d-flex align-items-center data ${operation.color_class}`}
                              >
                                <span className={`sq-icon ${operation.color_class}`}>
                                  <i className={`fa-solid ${ operation.icon }`}></i>
                                </span>
                                <div className="price-row ml-2">
                                  <span className="symbol">{CURRENCY.symbol}</span>
                                  <span className="value">{operation.convertedTotal}</span>
                                  <span className="term">{operation.convertedTotalExt}</span>
                                </div>
                              </div>
                            )
                            ): null
                          }
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-6 d-flex flex-column">
                  <div className="admin-card h-100 resp-card">
                    <div className="head">
                      <div className="left">
                        <h3 className="head-md">Compliance</h3>
                      </div>
                      <div className="right">
                        <DropDownMenu items={complianceDropdownMenuOptions()} />
                        {/*
                          <div className="dropdown ham-drop">
                            <a
                              href="/"
                              title="Menu"
                              className="dropdown-toggle"
                              data-toggle="dropdown"
                            >
                              <i className="fa-solid fa-bars"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right theme-drop">
                              <a href="/" title="List Item 1" className="link">
                                List Item 1
                              </a>
                              <a href="/" title="List Item 1" className="link">
                                List Item 1
                              </a>
                            </div>
                          </div>
                        */}
                      </div>
                    </div>
                    <div className="body d-flex flex-column h-100 position-relative pb-0">
                      {
                        licensesStats ? (
                          <div className="row">
                            <div className="col-sm-6 border-right">

                              {/* loader here */}
                              <div className="theme-loader auto">
                                <div className="loader-outer">
                                  <div className="loader">Loading...</div>
                                </div>
                              </div>
                              {/* loader here */}


                              <h3 className="md-head">Licenses</h3>
                              {
                                licensesStats.items.length ? (
                                  <>
                                    <div className="data-box">
                                      <div className="big-txt light">{ renewals.length }</div>
                                      <div className="f-med light">{ licensesStats.states.length } States</div>
                                    </div>
                                    <div className="data-box">
                                      {
                                        licensesStats.items.map((item, index: number) => (
                                          <div
                                            key={index}
                                            title={item.title}
                                            className={`data-bar ${item.color_class}`}
                                          >
                                            <div className="bar" style={{width: item.width}}></div>
                                            <div className="txt">{item.count}</div>
                                          </div>
                                        ))
                                      }
                                      {/*
                                        <div className="data-bar green">
                                          <div className="bar" style={{width: "80%"}}></div>
                                          <div className="txt">5</div>
                                        </div>
                                        <div className="data-bar orange">
                                          <div className="bar" style={{width: "30%"}}></div>
                                          <div className="txt">2</div>
                                        </div>
                                      */}
                                    </div>
                                  </>
                                ) : (
                                  <div className="py-5">
                                    <EmptyData width={80} />
                                  </div>
                                )
                              }
                              
                            </div>
                            <div className="col-sm-6">
                              <h3 className="md-head">Cost</h3>    
                              {
                                licensesStats.items.length ? (
                                  <div className="data-box sm-chart position-relative">
                                    <DonutChart data={licensesStats.items.map((licenseStateOperation) => ({ label: '', value: licenseStateOperation.count, color: licenseStateOperation.color_code }))} />
                                    <div className="custom-chart-data xy-abs w-100">
                                      <div className="price-row light">
                                        <span className="symbol">{CURRENCY.symbol}</span>
                                        <span className="value">{licensesStats.convertedTotal}</span>
                                        <span className="term">{licensesStats.convertedTotalExt}</span>
                                        {/*
                                          <span className="symbol">$</span>
                                          <span className="value">1.8</span>
                                          <span className="term">M</span>
                                        */}
                                      </div>
                                      <div className="f-med light pb-3">Annualy</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="py-5">
                                    <EmptyData width={80} />
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        ): null
                      }

                      <Accordion title="UPCOMING RENEWALS">
                        <table className="table table-striped">
                          <tbody>
                            {
                              renewals && renewals.length ? renewals.map((renewal: any) => (
                                <tr key={renewal._id}>
                                  <td>
                                    <span className="md-head">Next License Renewal</span>
                                    {/* <span className={`f-med text-${renewal.type_of_operation.color_class}`}>
                                      {renewal.store.location.address}, {renewal.store.location.state}
                                    </span> */}
                                  </td>
                                  <td className={`w-20 ${renewal.isExpiryNearBy ? 'text-danger' : 'light'}`}>
                                    {
                                      Moment(renewal.license_expiry_date).format('DD/MM/YYYY')
                                    }
                                  </td>
                                </tr>
                              )): (
                                <tr>
                                  <td colSpan={3} className="text-center">Data not found.</td>
                                </tr>
                              )
                            }
                          </tbody>
                        </table>
                      </Accordion>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 d-flex flex-column">
                  <div className="admin-card h-100 resp-card">
                    <div className="head">
                      <div className="left">
                        <h3 className="head-md">Insurance</h3>
                      </div>
                      <div className="right">
                        <DropDownMenu items={insuranceDropdownMenuOptions()} />
                        {/*
                          <div className="dropdown ham-drop">
                            <a
                              href="/"
                              title="Menu"
                              className="dropdown-toggle"
                              data-toggle="dropdown"
                            >
                              <i className="fa-solid fa-bars"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right theme-drop">
                              <a href="/" title="List Item 1" className="link">
                                List Item 1
                              </a>
                              <a href="/" title="List Item 1" className="link">
                                List Item 1
                              </a>
                            </div>
                          </div>
                        */}
                      </div>
                    </div>
                    <div className="body d-flex flex-column h-100 position-relative pb-0">
                      <div className="row">
                        <div className="col-sm-6 border-right">
                          <h3 className="md-head d-sm-block d-none">Policies</h3>
                          { policiesStats ? (
                            <div className="card-row-change">
                              {
                                policiesStats.items.length ? (
                                  <>
                                    <div className="data-box">
                                      <div className="big-txt light">{policiesStats.items.length}</div>
                                      <div className="d-sm-none f-med text-uppercase">Policies</div>
                                      <div className="f-med light">{policiesStats.states.length} States</div>
                                    </div>
                                    <div className="data-box w-100">
                                      {
                                        policiesStats.items.map((item: any, index: number) => (
                                          <div key={index} title={item.title} className={`data-bar ${item.color_class}`}>
                                            <div className="bar" style={{width: item.width}}></div>
                                            <div className="txt">{item.count}</div>
                                          </div>
                                        ))
                                      }
                                    </div> 
                                  </>
                                ) : (
                                  <div className="py-5">
                                    <EmptyData width={80} />
                                  </div>
                                )
                              }
                              
                              {/*
                                <div className="data-box w-100">
                                  <div className="data-bar green">
                                    <div className="bar" style={{width: "80%"}}></div>
                                    <div className="txt">19</div>
                                  </div>
                                  <div className="data-bar orange">
                                    <div className="bar" style={{width: "30%"}}></div>
                                    <div className="txt">5</div>
                                  </div>
                                </div>
                              */}

                              </div>
                            ): null 
                          }
                        </div>
                        <div className="col-sm-6">
                          <h3 className="md-head">Premium</h3>
                          {
                            policiesStats && policiesStats.items.length ? (
                              <div className="data-box sm-chart position-relative">
                                {
                                  policiesStats ? <DonutChart data={policiesStats.items.map(
                                    (policyStat: any) => (
                                      { label: '', value: policyStat.count, color: policyStat.color_code }))} />: null}
                                <div className="custom-chart-data xy-abs w-100">
                                  {
                                    policiesStats ? (
                                      <div className="price-row light">
                                        <span className="symbol">{CURRENCY.symbol}</span>
                                        <span className="value">{policiesStats.convertedTotal}</span>
                                        <span className="term">{policiesStats.convertedTotalExt}</span>
                                      </div>
                                    ): null
                                  }
                                  <div className="f-med light pb-3">Annualy</div>
                                </div>
                              </div>
                            ) : (
                              <div className="py-5">
                                <EmptyData width={80} />
                              </div>
                            )
                          }
                        </div>
                      </div>

                      <Accordion title="UPCOMING RENEWALS">
                        <table className="table table-striped">
                          <tbody>
                            {policies.length ? policies.map((policy: any) => (
                              <tr key={policy._id}>
                                <td>
                                  <span className="md-head">Next License Renewal</span>
                                  {/* <span className={`f-med text-${policy.type_of_operation.color_class}`}>
                                    {policy.store.location.address}, {policy.store.location.state}
                                  </span> */}
                                </td>
                                <td className={`w-20 ${policy.isExpiryNearBy ? 'text-danger' : 'light'}`}>
                                  {
                                    Moment(policy.expiry_date).format('DD/MM/YYYY')
                                  }
                                </td>
                              </tr>
                            )): (
                              <tr>
                                <td colSpan={3} className="text-center">Data not found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
