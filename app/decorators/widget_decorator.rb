class WidgetDecorator < Draper::Decorator
  delegate_all
  # decorates_association :datasets

  def units_to_s
    if money? || percentage?
      units
    elsif seconds?
      'Seconds'
    else
      'Numeric'
    end
  end

  def style
    arity = multiple? ? 'multiple' : 'single'
    "#{type} #{arity}"
  end

  def show_description?
    description.present?
  end

  def summary
    return '' if (has_no_data? || dataset.previous.blank?)

    date = dataset.previous.ts.to_formatted_s(:month_year)

    if dataset.trending?
      "#{dataset.trend.capitalize} by #{format(dataset.difference)} since #{date}"
    else
      "#{dataset.trend.capitalize} since #{date}"
    end
  end

  def humanised_last_updated
    last_updated_at.to_formatted_s(:day_month_year).strip
  end

  def format(change)
    case
      when dataset.percentage?
        helpers.number_to_percentage(change.abs, :precision => 2)
      when dataset.money?
        helpers.number_to_currency(change.abs)
      when dataset.integer?
        change.abs.to_i
      else
        change.abs
    end
  end

  def to_chart
    serializer = WidgetSerializer.new(widget, :include => 'datasets.datapoints')
    serializer.to_json
  end

  def datasets_to_chart
    object.datasets.collect{ |d| DatasetSerializer.new(d) }.to_json
  end

  def name_slug
    name.downcase.parameterize()
  end

end
