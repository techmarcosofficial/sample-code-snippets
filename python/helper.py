import math, sys
from datetime import datetime
from .constants import *

def parse_volume(volume):
    if '-' in volume:
        return int(volume.split('-')[-1].replace(',', '').strip())
    return int(volume.replace(',', ''))

def float_parser(value):
    return float(str(value).replace(',', ''))

def _round(value):
    num = value
    if num > 1:
        num = value % int(value)
    return math.ceil(value) if num == .5 else round(value)

def get_estates(employee_volume):
    results = {
        'without_governance': {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        },
        'with_governance': {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        },
        'savings': {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        }
    }

    without_governance = 0
    with_governance = 0
    for i in range(1, 6):
        try:
            if i == 1:
                without_governance += (employee_volume * GB_WORKFORCE_MEMBER[0][1]) / 1000
                with_governance += without_governance * (RELEVANT_RETENTIONABLE_DATA[0][1] / 100)
                results['without_governance'][i] = without_governance
                results['with_governance'][i] = with_governance
                results['savings'][i] = without_governance - with_governance
                continue
            
            without_governance = (
                without_governance + ((without_governance * ANNUAL_GROWTH_WITHOUT_GOVERNANCE[0][1]) / 100))
            with_governance = with_governance + (with_governance * (ANNUAL_GROWTH_WITH_GOVERNANCE[0][1] / 100))
            results['without_governance'][i] = without_governance
            results['with_governance'][i] = with_governance
            results['savings'][i] = without_governance - with_governance
        except:
            pass
    return results

def get_ediscovery_annual_costs(estate, **kwargs):
    results = {
        'litigation_volume_short': list(kwargs['litigation_volume'].values())[0].split('(')[0].strip(),
        'litigation_volume': list(kwargs['litigation_volume'].values())[0],
        'content_litigation_hold': [],
        'content_produced': [],
        'processing_fees': [],
        'producing_fees': [],
        'ediscovery_fees': [],
        'annual_litigation': [],
        'total': 0,
    }

    def get_litigation_volume_fees():
        litigation_volume = NO_LITIGATION_VOLUME[0][1]
        production_percentage = No_PRODUCTION_PERCENTAGE[0][1]
        annual_total_litigation_volume = ANNUAL_NO_LITIGATION_VOLUME[0][1]

        litigation_keys = list(kwargs['litigation_volume'].keys())
        if 'Low' in litigation_keys:
            litigation_volume = LOW_LITIGATION_VOLUME[0][1]
            production_percentage = LOW_PRODUCTION_PERCENTAGE[0][1]
            annual_total_litigation_volume = ANNUAL_LOW_LITIGATION_VOLUME[0][1]
        elif 'Medium' in litigation_keys:
            litigation_volume = MEDIUM_LITIGATION_VOLUME[0][1]
            production_percentage = MEDIUM_PRODUCTION_PERCENTAGE[0][1]
            annual_total_litigation_volume = ANNUAL_MEDIUM_LITIGATION_VOLUME[0][1]
        elif 'High' in litigation_keys:
            litigation_volume = HIGH_LITIGATION_VOLUME[0][1]
            production_percentage = HIGH_PRODUCTION_PERCENTAGE[0][1]
            annual_total_litigation_volume = ANNUAL_HIGH_LITIGATION_VOLUME[0][1]
        return {
            'litigation_volume': litigation_volume,
            'production_percentage': production_percentage,
            'annual_total_litigation_volume': annual_total_litigation_volume
        }
    try:
        litigation_data = get_litigation_volume_fees()
        for i in range(1, 6):
            litigation_hold_without_gov = estate['without_governance'][i] * (litigation_data['litigation_volume'] / 100)
            litigation_hold_with_gov = estate['with_governance'][i] * (litigation_data['litigation_volume'] / 100)
            results['content_litigation_hold'].append({
                'without_governance': litigation_hold_without_gov,
                'with_governance': litigation_hold_with_gov,
                'savings': litigation_hold_without_gov - litigation_hold_with_gov,
            })

            content_produced_without_gov = (litigation_hold_without_gov * (litigation_data['production_percentage'] / 100)) * 1000
            content_produced_with_gov = (litigation_hold_with_gov * (litigation_data['production_percentage'] / 100)) * 1000
            results['content_produced'].append({
                'without_governance': round(content_produced_without_gov, 2),
                'with_governance': round(content_produced_with_gov, 2),
                'savings': round(content_produced_without_gov - content_produced_with_gov, 2),
            })
            
            processing_fees_without_gov = content_produced_without_gov * DATA_PROCESSING_FEES[0][1]
            processing_fees_with_gov = content_produced_with_gov * DATA_PROCESSING_FEES[0][1]
            results['processing_fees'].append({
                'without_governance': _round(processing_fees_without_gov),
                'with_governance': _round(processing_fees_with_gov),
                'savings': _round(processing_fees_without_gov - processing_fees_with_gov),
            })

            producing_fees_without_gov = processing_fees_without_gov * PRODUCTION_MULTIPLIER[0][1]
            producing_fees_with_gov = processing_fees_with_gov * PRODUCTION_MULTIPLIER[0][1]
            results['producing_fees'].append({
                'without_governance': _round(producing_fees_without_gov),
                'with_governance': _round(producing_fees_with_gov),
                'savings': _round(producing_fees_without_gov - producing_fees_with_gov),
            })

            ediscovery_fees_without_gov = processing_fees_without_gov + producing_fees_without_gov
            ediscovery_fees_with_gov = processing_fees_with_gov + producing_fees_with_gov
            results['ediscovery_fees'].append({
                'without_governance': round(ediscovery_fees_without_gov),
                'with_governance': round(ediscovery_fees_with_gov, 2),
                'savings': round(ediscovery_fees_without_gov - ediscovery_fees_with_gov, 2),
            })
            
            annual_without_governance = litigation_data['annual_total_litigation_volume'] * ediscovery_fees_without_gov
            annual_with_governance = litigation_data['annual_total_litigation_volume'] * ediscovery_fees_with_gov
            annual_savings = annual_without_governance - annual_with_governance
            results['annual_litigation'].append({
                'title': 'Total eDiscovery Fees (Year %d)' % i,
                'without_governance': f"{annual_without_governance:,.2f}",
                'with_governance': f"{annual_with_governance:,.2f}",
                'savings': f"{annual_savings:,.2f}",
            })
            results['total'] += annual_savings
    except:
        pass
    total = results['total']
    results['total'] = f"{total:,.2f}"
    results['total_num'] = f"{_round(total):,}"
    return results

def get_digital_storages(estate):
    results = {
        'total': 0,
        'items': [],
    }
    for i in range(1, 6):
        try:
            estate_without_gov = estate['without_governance'][i] * ANNUAL_COST_PER_TB[0][1]
            estate_with_gov = estate['with_governance'][i] * ANNUAL_COST_PER_TB[0][1]
            savings = estate_without_gov - estate_with_gov
            results['items'].append({
                'title': 'Digital Estate Storage Costs (Year %d)' % i,
                'without_governance': f"{estate_without_gov:,.2f}",
                'with_governance': f"{estate_with_gov:,.2f}",
                'savings': f"{savings:,.2f}"
            })
            results['total'] += savings
        except:
            pass
    total = results['total']
    results['total'] = f"{total:,.2f}"
    results['total_num'] = f"{_round(total):,}"
    return results

def get_paper_storage_costs(paper_storage, **kwargs):
    def get_paper_storage():
        paper_storage_volume = 0
        if '10,000' in list(paper_storage.keys()):
            paper_storage_volume = 10000
        if '10,000 - 50,000' in list(paper_storage.keys()):
            paper_storage_volume = 50000
        if '50,000 - 100,000' in list(paper_storage.keys()):
            paper_storage_volume = 100000
        if '100,000 - 250,000' in list(paper_storage.keys()):
            paper_storage_volume = 250000
        if '250,000 - 10,00,000' in list(paper_storage.keys()):
            paper_storage_volume = 1000000
        return paper_storage_volume

    def get_paper_growth():
        growth_percentage = 0
        if 'Low' in kwargs['paper_growth']:
            growth_percentage = 5
        if 'Medium' in kwargs['paper_growth']:
            growth_percentage = 10
        if 'High' in kwargs['paper_growth']:
            growth_percentage = 25
        return growth_percentage

    based_paper_volume = get_paper_storage()
    results = {
        'paper_volume': list(paper_storage.values())[0],
        'annual_paper_growth': kwargs['paper_growth'],
        'based_paper_volume': f"{based_paper_volume:,}" ,
        'paper_annual_growth_percentage': {
            'without_governance': get_paper_growth(),
            'with_governance': PAPER_STORAGE_WITH_GOVERNANCE[0][1],
        },
        'paper_storage_volume': f"{ANNUAL_PURGE[0][1]}%",
        'organisation_paper_volume': ORGAINSATION_PAPER_VOLUME[0][1],
        'paper_storages': [],
        'paper_storages_costs': [],
        'total': 0,
    }
    
    for i in range(1, 6):
        try:
            paper_growth = results['paper_annual_growth_percentage']
            if i == 1:
                paper_without_governance = based_paper_volume + ((based_paper_volume * paper_growth['without_governance']) / 100)
                paper_with_governance = (based_paper_volume * RELEVANT_RETENTIONABLE_DATA[0][1]) / 100
                paper_savings = paper_without_governance - paper_with_governance
                results['paper_storages'].append({
                    'title': 'Paper Storage Year %d' % i,
                    'without_governance': f"{_round(paper_without_governance):,}",
                    'with_governance': f"{_round(paper_with_governance):,}",
                    'savings': f"{_round(paper_savings):,}",
                })
                storage_without_governance = paper_without_governance * STORAGE_COST_PER_BOX[0][1]
                storage_with_governance = paper_with_governance * STORAGE_COST_PER_BOX[0][1]
                savings = storage_without_governance - storage_with_governance
                results['paper_storages_costs'].append({
                    'title': 'Paper Storage Cost Year %d' % i,
                    'without_governance': f"{storage_without_governance:,.2f}",
                    'with_governance': f"{storage_with_governance:,.2f}",
                    'savings': f"{savings:,.2f}",
                })
                results['total'] += savings
                continue
            
            paper_without_governance = paper_without_governance + ((paper_without_governance * paper_growth['without_governance']) / 100)
            paper_with_governance = paper_with_governance - ((paper_with_governance * ANNUAL_GROWTH_WITH_GOVERNANCE[0][1]) / 100)
            paper_savings = paper_without_governance - paper_with_governance
            results['paper_storages'].append({
                'title': 'Paper Storage Year %d' % i,
                'without_governance': f"{_round(paper_without_governance):,}",
                'with_governance': f"{_round(paper_with_governance):,}",
                'savings': f"{_round(paper_savings):,}",
            })
            storage_without_governance = paper_without_governance * STORAGE_COST_PER_BOX[0][1]
            storage_with_governance = paper_with_governance * STORAGE_COST_PER_BOX[0][1]
            savings = storage_without_governance - storage_with_governance
            results['paper_storages_costs'].append({
                'title': 'Paper Storage Cost Year %d' % i,
                'without_governance': f"{storage_without_governance:,.2f}",
                'with_governance': f"{storage_with_governance:,.2f}",
                'savings': f"{savings:,.2f}",
            })
            results['total'] += savings
        except:
            pass
    total = results['total']
    results['total'] = f"{total:,.2f}"
    results['total_num'] = f"{_round(total):,}"
    return results

def get_tape_management_data(estate, **kwargs):
    def get_tape_backup():
        tape_backup = 0
        tape_backup_keys = list(kwargs['tape_backup_utilization'])
        if 'Partial' in tape_backup_keys:
            tape_backup = 50
        if 'Full' in tape_backup_keys:
            tape_backup = 100
        return tape_backup

    results = {
        'tape_backup_utilization': list(kwargs['tape_backup_utilization'].values())[0],
        'environment_backup_upto_tape': get_tape_backup(),
        'tape_needed_backup_environment': {
            'without_governance': 0,
            'with_governance': 0,  # formula not given, now set half of the value
        },
        'total_tape_required_annually': {
            'without_governance': 0,
            'with_governance': 0,
        },
        'cost_of_one_year_tapes': {
            'without_governance': 0,
            'with_governance': 0,
        },
        'storage_of_tape_per_year': {
            'without_governance': 0,
            'with_governance': 0,
        },
        'tape_governance_benefits': f"{ANNUAL_GROWTH_WITHOUT_GOVERNANCE[0][1]}%",
        'average_tape_capicity': f"{AVERAGE_TAPE_CAPACITY[0][1]}TB",
        'items': [],
        'total': 0,
    }
    
    if results['environment_backup_upto_tape'] == 0:
        results['items'].extend([
            {
                'title': 'Tape Storage Cost Year %d' % i,
                'without_governance': 0,
                'with_governance': 0,
                'savings': 0
            } for i in range(1, 6)])
        results['total'] = "0.00"
    else:
        results['tape_needed_backup_environment']['without_governance'] = math.ceil(
            (list(estate['without_governance'].values())[0] * (results['environment_backup_upto_tape'] / 100)) / AVERAGE_TAPE_CAPACITY[0][1]
        )
        results['tape_needed_backup_environment']['with_governance'] = round(results['tape_needed_backup_environment']['without_governance'] / 2)
        results['total_tape_required_annually']['without_governance'] = results['tape_needed_backup_environment']['without_governance'] * ANNUAL_BACKUP_RUNS[0][1]
        results['total_tape_required_annually']['with_governance'] = round(results['total_tape_required_annually']['without_governance'] / 2)
        tape_cost = results['total_tape_required_annually']['without_governance'] * COST_PER_TAPE[0][1]
        storage_cost = results['total_tape_required_annually']['without_governance'] * 12
        results['cost_of_one_year_tapes']['without_governance'] = f"{tape_cost:,.2f}"
        results['cost_of_one_year_tapes']['with_governance'] = f"{round(tape_cost / 2):,.2f}"
        results['storage_of_tape_per_year']['without_governance'] = f"{storage_cost:,.2f}"
        results['storage_of_tape_per_year']['with_governance'] = f"{round(storage_cost / 2):,.2f}"
        for i in range(1, 6):
            without_governance = tape_cost + storage_cost
            with_governance = without_governance / 2
            savings = without_governance - with_governance
            results['items'].append({
                'title': 'Tape Storage Cost Year %d' % i,
                'without_governance': f"{without_governance:,.2f}",
                'with_governance': f"{with_governance:,.2f}",
                'savings': f"{savings:,.2f}"
            })
            results['total'] += savings
        total = results['total']
        results['total'] = f"{total:,.2f}"
        results['total_num'] = f"{_round(total):,}"
    return results

def get_roi_detail(**kwargs):
    result = {
        'items': [],
        'total': 0,
    }
    for i in range(5):
        ediscovery = kwargs['ediscovery']['annual_litigation']
        digital_storage = kwargs['digital_storage']['items']
        paper_storage = kwargs['paper_storage']['paper_storages_costs']
        tape_management = kwargs['tape_management']['items']
        without_governance = 0
        with_governance = 0
        savings = 0
        if len(ediscovery):
            without_governance += float_parser(ediscovery[i]['without_governance'])
            with_governance    += float_parser(ediscovery[i]['with_governance'])
            savings            += (float_parser(ediscovery[i]['without_governance']) - float_parser(ediscovery[i]['with_governance']))
        if len(digital_storage):
            without_governance += float_parser(digital_storage[i]['without_governance'])
            with_governance    += float_parser(digital_storage[i]['with_governance'])
            savings            += (float_parser(digital_storage[i]['without_governance']) - float_parser(digital_storage[i]['with_governance']))
        if len(paper_storage):
            without_governance += float_parser(paper_storage[i]['without_governance'])
            with_governance    += float_parser(paper_storage[i]['with_governance'])
            savings            += (float_parser(paper_storage[i]['without_governance']) - float_parser(paper_storage[i]['with_governance']))
        if len(tape_management):
            without_governance += float_parser(tape_management[i]['without_governance'])
            with_governance    += float_parser(tape_management[i]['with_governance'])
            savings            += (float_parser(tape_management[i]['without_governance']) - float_parser(tape_management[i]['with_governance']))
        result['items'].append({
            'without_governance': f"{without_governance:,.2f}",
            'with_governance': f"{with_governance:,.2f}",
            'savings': f"{savings:,.2f}"
        })
        result['total'] += savings
    result['total'] = f"{round(result['total']):,}"
    return result
