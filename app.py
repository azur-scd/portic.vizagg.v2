from flask_json import FlaskJSON, json_response
import pandas as pd
import vaex
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from dotenv import dotenv_values
import json
from flask import Flask, jsonify, request, abort, render_template, url_for, request, session, redirect, send_from_directory, Response, Blueprint
import requests

env = dotenv_values(".env")
port = env['APP_PORT']
host = env['APP_HOST']
api_version = env['API_VERSION']
# url_subpath = env['URL_SUBPATH']

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
FlaskJSON(app)
api = Api(app)

##### Functions ######
def get_portic_data():
    # df = pd.read_json("static/data/travels.json")
    df = vaex.from_json('static/data/travels.json',
                        orient='records', copy_index=False)
    return df


def data_to_use(df, filtered_df):
    if filtered_df.shape[0] == 0:
        return df
    else:
        return filtered_df


def crosstab_uncertainity(df, key):
    data = (df.groupby(df[key]).agg(
        {'0': vaex.agg.count(df["travel_id"], selection=df[f"{key}_uncertainity"] == 0),
         '-1': vaex.agg.count(df["travel_id"], selection=df[f"{key}_uncertainity"] == -1),
         '-2': vaex.agg.count(df["travel_id"], selection=df[f"{key}_uncertainity"] == -2),
         '-3': vaex.agg.count(df["travel_id"], selection=df[f"{key}_uncertainity"] == -3),
         '-4': vaex.agg.count(df["travel_id"], selection=df[f"{key}_uncertainity"] == -4),
         '-5': vaex.agg.count(df["travel_id"], selection=df[f"{key}_uncertainity"] == -5),
         'total': vaex.agg.count(df["travel_id"])}
    ).
    sort('total', ascending=False))
    return data

def crosstab_products(df,key):
    products_list = df[key].unique()
    data = (df.groupby(df.outdate_fixed_datetime_month_number).agg(
    {f'{product}': vaex.agg.count(df.travel_id, selection=df[key] == f'{product}') for product in products_list}
    )
    .sort('outdate_fixed_datetime_month_number', ascending=True))
    return data,products_list

#### Variables & constants #####
cols = ['travel_id', 'distance_dep_dest_miles', 'departure',
        'departure_latitude', 'departure_longitude', 'departure_admiralty',
        'departure_province', 'departure_uncertainity', 'destination',
        'destination_latitude', 'destination_longitude',
        'destination_admiralty', 'destination_province',
        'destination_uncertainity', 'tonnage', 'commodity_standardized_fr',
        'outdate_fixed_datetime', 'outdate_fixed_datetime_month_number',
        'outdate_fixed_datetime_month_name', 'outdate_fixed_datetime_week']
portic_api_vaex_df = get_portic_data()
geog_data = pd.read_csv(
    "static/data/geographical_hierarchy.csv", sep=",", encoding="utf-8")
ports_list = geog_data[geog_data["group"] == "port"]["name"].tolist()
filtered_vaex_df = vaex.from_pandas(
    df=pd.DataFrame(columns=cols), copy_index=False)

###### routing for pages ######

@app.route('/')
@app.route('/flux')
def fluxpage():
    return render_template('flux.html')

@app.route('/storytelling')
def storytellingpage():
    return render_template('storytelling.html')

@app.route('/test')
def testpage(chartID='chart_ID', chart_type='bar', chart_height=350):
    chart = {"renderTo": chartID, "type": chart_type, "height": chart_height, }
    series = [{"name": 'Label1', "data": [1, 2, 3]},
              {"name": 'Label2', "data": [4, 5, 6]}]
    title = {"text": 'My Title'}
    xAxis = {"categories": ['xAxis Data1', 'xAxis Data2', 'xAxis Data3']}
    yAxis = {"title": {"text": 'yAxis Label'}}
    return render_template('test.html', chartID=chartID, chart=chart, series=series, title=title, xAxis=xAxis, yAxis=yAxis)

###### API #######


@api.representation('application/json')
def output_json(data, code):
    return json_response(data_=data, status_=code)


class Filter:
    supported_operators = ("eq", "ne", "lt", "gt", "le", "ge")

    def __init__(self, column, operator, value):
        self.column = column
        self.operator = operator
        self.value = value


def create_filters(filters):
    filters_processed = []
    if filters is None:
        # No filters given
        return filters_processed
    elif isinstance(filters, str):
        # if only one filter given
        filter_split = filters.split(",")
        filters_processed.append(
            Filter(*filter_split)
        )
    elif isinstance(filters, list):
        # if more than one filter given
        try:
            filters_processed = [Filter(*_filter.split(","))
                                 for _filter in filters]
        except Exception:
            raise TypeError(
                f"filter query invalid "
            )
    else:
        # Programer error
        raise TypeError(
            f"filters expected to be `str` or list "
            f"but was of type `{type(filters)}`"
        )

    return filters_processed


class HelloWorld(Resource):
    def get(self):
        # Default to 200 OK
        return jsonify({'msg': 'Hello world'})


class PorticApiSample(Resource):
    def get(self):
        return jsonify(portic_api_vaex_df.sample(10).to_records())


#parser = reqparse.RequestParser()

class Filters(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('departure_selected_data', type=str, location='form')
        self.reqparse.add_argument('destination_selected_data', type=str, location='form')
        self.reqparse.add_argument('uncertainity_selected_data', type=str, location='form')
    def post(self):
        global filtered_vaex_df
        # data = request.form
        returned_all_ports_string = "Tous les ports"
        args = self.reqparse.parse_args()
        if (args['departure_selected_data'] == '') | (args['departure_selected_data'] is None):
            deps = ports_list
            returned_string_deps = returned_all_ports_string
        else:
            deps = list(args['departure_selected_data'].split(","))
            if len(deps) != 317:
                returned_string_deps = ", ".join([s for s in deps])
            else:
                returned_string_deps = returned_all_ports_string
        if (args['destination_selected_data'] == '') | (args['destination_selected_data'] is None):
            dests = ports_list
            returned_string_dests = returned_all_ports_string
        else:
            dests = list(args['destination_selected_data'].split(","))
            if len(deps) != 317:
                returned_string_dests = ", ".join([s for s in dests])
            else:
                returned_string_dests = returned_all_ports_string
        uncertainity = list(args['uncertainity_selected_data'].split(","))
        returned_string_uncertainity = args['uncertainity_selected_data']
        filtered_vaex_df = portic_api_vaex_df[(portic_api_vaex_df["departure"].isin(
            deps)) & (portic_api_vaex_df["destination"].isin(dests)) & (portic_api_vaex_df["travel_uncertainity"].isin(uncertainity))]
        # ex html mustache : <p> Ports de destination {{'{{destination}}'}}</p>
        return jsonify({"departure": returned_string_deps, "destination": returned_string_dests, 'uncertainity':  returned_string_uncertainity})


class FilteredData(Resource):
    def get(self):
        return jsonify(data_to_use(portic_api_vaex_df, filtered_vaex_df).to_records())

class StatsFilteredData(Resource):
    def get(self):
        filter_df = data_to_use(portic_api_vaex_df, filtered_vaex_df)
        percent_travels = round(filter_df.shape[0] / portic_api_vaex_df.shape[0] * 100)
        percent_tonnage = round(filter_df.tonnage.sum() / portic_api_vaex_df.tonnage.sum() * 100)
        percent_unknown_products = round(filter_df[filter_df.commodity_standardized_fr.notna()].travel_id.count() / filter_df.travel_id.count() * 100)
        return jsonify({"percent_travels": percent_travels, "percent_tonnage": percent_tonnage, "percent_unknown_products": percent_unknown_products})

class UncertainityCrosstabData(Resource):
    def get(self,key):
        data = crosstab_uncertainity(data_to_use(portic_api_vaex_df, filtered_vaex_df), key)
        return jsonify(data.to_records())

class ProductsCrosstabData(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('key', type = str, location='args')
    def get(self):
        args = self.reqparse.parse_args()
        data, products = crosstab_products(data_to_use(portic_api_vaex_df, filtered_vaex_df),args["key"])
        return jsonify({"data":data.to_records(), "products": products})

class SimpleGroupbyData(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('key', type = str, location='args', action='append')
        self.reqparse.add_argument('aggkey', type = str, location='args')
        self.reqparse.add_argument('aggtype', type = str, location='args', action='append')
    def get(self):
        # Example API : /api/v1/simple_groupby_data?key=departure_province&key=departure_admiralty&aggkey=tonnage&aggtype=mean&aggtype=sum
        # gives this data processing : data.groupby(by=['departure_province','departure_admiralty']).agg({"tonnage":["mean","sum"]})
        args = self.reqparse.parse_args()
        data = data_to_use(portic_api_vaex_df, filtered_vaex_df)
        #groupby_data  = data[data[args["key"][0]].dropmissing()].groupby(by=args["key"]).agg({args["aggkey"]:args["aggtype"]})
        #groupby_data  = data.groupby(by=args["key"]).agg({args["aggkey"]:args["aggtype"]})
        groupby_data  = data[data[args["key"][0]].notna()].groupby(by=args["key"]).agg({args["aggkey"]:args["aggtype"]})
        return jsonify(groupby_data.to_records())


api.add_resource(
    HelloWorld, f'/api/{api_version}', f'/api/{api_version}/hello')
api.add_resource(PorticApiSample, f'/api/{api_version}/porticapi/sample')
api.add_resource(Filters, f'/api/{api_version}/filters')
api.add_resource(FilteredData, f'/api/{api_version}/filtered_data')
api.add_resource(StatsFilteredData, f'/api/{api_version}/stats_filtered_data')
api.add_resource(UncertainityCrosstabData, f'/api/{api_version}/uncertainity_crosstab_data/<string:key>')
api.add_resource(ProductsCrosstabData, f'/api/{api_version}/products_crosstab_data')
api.add_resource(SimpleGroupbyData, f'/api/{api_version}/simple_groupby_data')

if __name__ == '__main__':
    app.run(debug=True, port=port, host=host)
